from pydantic import BaseModel, Field
from typing import List, Optional

class ForecastRequest(BaseModel):
    metal: str = Field(..., description="Metal type: aluminium, copper, lead, nickel, zinc, silver, gold")
    weight_kg: float = Field(..., gt=0, description="Weight of metal in kilograms")

class ForecastDataPoint(BaseModel):
    date: str
    price: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None

class ForecastResponse(BaseModel):
    metal: str
    current_price: float
    forecast_90d: List[ForecastDataPoint]
    recommendation: str           # "SELL NOW" or "HOLD"
    recommendation_reason: str
    profit_if_sell: Optional[float] = None   # Only when SELL
    expected_peak_price: Optional[float] = None  # Only when HOLD
    expected_peak_date: Optional[str] = None     # Only when HOLD
    mape: float
    rmse: float
    model_used: str               # "ARIMA" or "LSTM" or "ARIMA+LSTM"
    weight_kg: float
    unit_price: float             # USD per kg
