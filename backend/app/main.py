from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .config import settings
from .mt5_service import mt5_service

app = FastAPI(title="Javis MT5 Backend", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MT5ConnectRequest(BaseModel):
    login: int = Field(gt=0)
    password: str = Field(min_length=1)
    server: str = Field(min_length=1)
    path: str | None = None


def handle(fn):
    try:
        return fn()
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
