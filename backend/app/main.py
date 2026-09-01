from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .config import settings
from .mt5_service import mt5_service
from .websocket import router as websocket_router

app = FastAPI(title="Javis MT5 Backend", version="1.1.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(websocket_router)


class MT5ConnectRequest(BaseModel):
    login: int = Field(gt=0)
    password: str = Field(min_length=1)
    server: str = Field(min_length=1)
    path: str | None = None


class OrderRequest(BaseModel):
    symbol: str = Field(min_length=1, max_length=64)
    side: str
    volume: float = Field(gt=0)
    sl: float | None = Field(default=None, ge=0)
    tp: float | None = Field(default=None, ge=0)
    deviation: int = Field(default=20, ge=0, le=1000)
    magic: int = Field(default=260901, ge=0)


class ClosePositionRequest(BaseModel):
    ticket: int = Field(gt=0)
    deviation: int = Field(default=20, ge=0, le=1000)


def handle(fn):
    try:
        return fn()
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.get("/health")
def health():
    return {"status": "ok", "mt5_connected": mt5_service.connected}


@app.post("/api/mt5/connect")
def connect(req: MT5ConnectRequest):
    return handle(lambda: {"connected": True, "account": mt5_service.connect(req.login, req.password, req.server, req.path)})


@app.post("/api/mt5/disconnect")
def disconnect():
    mt5_service.disconnect()
    return {"connected": False}


@app.get("/api/mt5/account")
def account():
    return handle(mt5_service.account)


@app.get("/api/mt5/symbols")
def symbols(limit: int = 100):
    return handle(lambda: mt5_service.symbols(max(1, min(limit, 500))))


@app.get("/api/mt5/tick/{symbol}")
def tick(symbol: str):
    return handle(lambda: mt5_service.tick(symbol))


@app.get("/api/mt5/positions")
def positions():
    return handle(mt5_service.positions)


@app.post("/api/mt5/orders")
def create_order(req: OrderRequest):
    return handle(lambda: mt5_service.order(req.symbol, req.side.lower(), req.volume, req.sl, req.tp, req.deviation, req.magic))


@app.post("/api/mt5/positions/close")
def close_position(req: ClosePositionRequest):
    return handle(lambda: mt5_service.close_position(req.ticket, req.deviation))
