from __future__ import annotations

import threading
from typing import Any

import MetaTrader5 as mt5

from .config import settings


class MT5Service:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.connected = False

    def connect(self, login: int | None = None, password: str | None = None, server: str | None = None, path: str | None = None) -> dict[str, Any]:
        with self._lock:
            kwargs: dict[str, Any] = {}
            login = login or settings.mt5_login
            password = password or settings.mt5_password
            server = server or settings.mt5_server
            path = path or settings.mt5_path
            if login: kwargs["login"] = login
            if password: kwargs["password"] = password
            if server: kwargs["server"] = server
            ok = mt5.initialize(path, **kwargs) if path else mt5.initialize(**kwargs)
            if not ok:
                self.connected = False
                code, message = mt5.last_error()
                raise RuntimeError(f"MT5 initialize failed ({code}): {message}")
            self.connected = True
            return self.account()

    def disconnect(self) -> None:
        with self._lock:
            mt5.shutdown()
            self.connected = False

    def _ensure_connected(self) -> None:
        if not self.connected:
            raise RuntimeError("MT5 is not connected")

    def account(self) -> dict[str, Any]:
        self._ensure_connected()
        info = mt5.account_info()
        if info is None:
            code, message = mt5.last_error()
            raise RuntimeError(f"MT5 account unavailable ({code}): {message}")
        return info._asdict()

    def symbols(self, limit: int = 100) -> list[dict[str, Any]]:
        self._ensure_connected()
        values = mt5.symbols_get() or []
        return [{"name": s.name, "visible": s.visible, "trade_mode": s.trade_mode} for s in values[:limit]]

    def tick(self, symbol: str) -> dict[str, Any]:
        self._ensure_connected()
        if not mt5.symbol_select(symbol, True):
            raise RuntimeError(f"Unable to select symbol: {symbol}")
        tick = mt5.symbol_info_tick(symbol)
        if tick is None:
            raise RuntimeError(f"No tick data for: {symbol}")
        return tick._asdict()

    def positions(self) -> list[dict[str, Any]]:
        self._ensure_connected()
        positions = mt5.positions_get() or []
        return [p._asdict() for p in positions]

    def order(self, symbol: str, side: str, volume: float, sl: float | None = None, tp: float | None = None, deviation: int = 20, magic: int = 260901) -> dict[str, Any]:
        self._ensure_connected()
        if side not in {"buy", "sell"}: raise ValueError("side must be 'buy' or 'sell'")
        if volume <= 0: raise ValueError("volume must be greater than zero")
        if not mt5.symbol_select(symbol, True): raise RuntimeError(f"Unable to select symbol: {symbol}")
        info, tick = mt5.symbol_info(symbol), mt5.symbol_info_tick(symbol)
        if info is None or tick is None: raise RuntimeError(f"Symbol data unavailable: {symbol}")
        order_type = mt5.ORDER_TYPE_BUY if side == "buy" else mt5.ORDER_TYPE_SELL
        price = tick.ask if side == "buy" else tick.bid
        request = {"action": mt5.TRADE_ACTION_DEAL, "symbol": symbol, "volume": volume, "type": order_type, "price": price, "sl": sl or 0.0, "tp": tp or 0.0, "deviation": deviation, "magic": magic, "comment": "Javis", "type_time": mt5.ORDER_TIME_GTC, "type_filling": info.filling_mode}
        result = mt5.order_send(request)
        if result is None:
            code, message = mt5.last_error()
            raise RuntimeError(f"Order request failed ({code}): {message}")
        if result.retcode != mt5.TRADE_RETCODE_DONE: raise RuntimeError(f"Order rejected: retcode={result.retcode}, comment={result.comment}")
        return result._asdict()

    def close_position(self, ticket: int, deviation: int = 20) -> dict[str, Any]:
        self._ensure_connected()
        positions = mt5.positions_get(ticket=ticket)
        if not positions: raise RuntimeError(f"Position not found: {ticket}")
        position = positions[0]
        tick, info = mt5.symbol_info_tick(position.symbol), mt5.symbol_info(position.symbol)
        if tick is None or info is None: raise RuntimeError(f"Symbol data unavailable: {position.symbol}")
        side = mt5.ORDER_TYPE_SELL if position.type == mt5.POSITION_TYPE_BUY else mt5.ORDER_TYPE_BUY
        price = tick.bid if position.type == mt5.POSITION_TYPE_BUY else tick.ask
        request = {"action": mt5.TRADE_ACTION_DEAL, "symbol": position.symbol, "volume": position.volume, "type": side, "position": position.ticket, "price": price, "deviation": deviation, "magic": 260901, "comment": "Javis close", "type_time": mt5.ORDER_TIME_GTC, "type_filling": info.filling_mode}
        result = mt5.order_send(request)
        if result is None or result.retcode != mt5.TRADE_RETCODE_DONE:
            detail = "no result" if result is None else f"retcode={result.retcode}, comment={result.comment}"
            raise RuntimeError(f"Close rejected: {detail}")
        return result._asdict()


mt5_service = MT5Service()
