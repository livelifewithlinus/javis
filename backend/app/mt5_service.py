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
            if login:
                kwargs["login"] = login
            if password:
                kwargs["password"] = password
            if server:
                kwargs["server"] = server
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

    def account(self) -> dict[str, Any]:
        info = mt5.account_info()
        if info is None:
            code, message = mt5.last_error()
            raise RuntimeError(f"MT5 account unavailable ({code}): {message}")
        return info._asdict()

    def symbols(self, limit: int = 100) -> list[dict[str, Any]]:
        values = mt5.symbols_get() or []
        return [{"name": s.name, "visible": s.visible, "trade_mode": s.trade_mode} for s in values[:limit]]

    def tick(self, symbol: str) -> dict[str, Any]:
        if not mt5.symbol_select(symbol, True):
            raise RuntimeError(f"Unable to select symbol: {symbol}")
        tick = mt5.symbol_info_tick(symbol)
        if tick is None:
            raise RuntimeError(f"No tick data for: {symbol}")
        return tick._asdict()

    def positions(self) -> list[dict[str, Any]]:
        positions = mt5.positions_get() or []
        return [p._asdict() for p in positions]


mt5_service = MT5Service()
