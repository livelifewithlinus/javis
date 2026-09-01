from __future__ import annotations

import asyncio
import contextlib
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from .mt5_service import mt5_service

router = APIRouter()


@router.websocket("/ws/mt5")
async def mt5_socket(websocket: WebSocket):
    await websocket.accept()
    symbols: set[str] = set()
    try:
        while True:
            try:
                message = await asyncio.wait_for(websocket.receive_text(), timeout=1.0)
                payload = json.loads(message)
                action = payload.get("action")
                if action == "subscribe":
                    symbols.update(payload.get("symbols", []))
                    await websocket.send_json({"event": "subscribed", "symbols": sorted(symbols)})
                elif action == "unsubscribe":
                    symbols.difference_update(payload.get("symbols", []))
                    await websocket.send_json({"event": "unsubscribed", "symbols": sorted(symbols)})
                elif action == "ping":
                    await websocket.send_json({"event": "pong"})
                else:
                    await websocket.send_json({"event": "error", "message": "Unknown action"})
            except asyncio.TimeoutError:
                pass

            if mt5_service.connected:
                for symbol in list(symbols):
                    try:
                        tick = mt5_service.tick(symbol)
                        await websocket.send_json({"event": "tick", "symbol": symbol, "data": tick})
                    except Exception as exc:
                        await websocket.send_json({"event": "error", "symbol": symbol, "message": str(exc)})
    except WebSocketDisconnect:
        return
    except Exception:
        with contextlib.suppress(Exception):
            await websocket.close()
