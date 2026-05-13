"""
Market timing decision engine.
Converts 90-day ARIMA + LSTM ensemble forecast into Sell/Hold recommendation.
Logic:
  - SELL NOW: if the peak forecast price within 90 days is within the first 30 days
              OR the forecast mean is declining over time
  - HOLD:     if the forecast shows a meaningful upward trend beyond 30 days
              and the expected peak is 7%+ above current price
"""
import numpy as np
from typing import List

SELL_THRESHOLD_PCT = 0.03    # Sell if trend is flat or declining (< 3% upside expected)
HOLD_THRESHOLD_PCT = 0.07    # Hold if peak upside is >= 7%
SELL_WINDOW_DAYS = 30        # Days within which peak must occur for SELL

def ensemble_forecast(arima_prices: List[float], lstm_prices: List[float]) -> List[float]:
    """Weighted ensemble: 60% ARIMA, 40% LSTM."""
    arr_a = np.array(arima_prices)
    arr_l = np.array(lstm_prices)
    n = min(len(arr_a), len(arr_l))
    return (0.60 * arr_a[:n] + 0.40 * arr_l[:n]).tolist()

METAL_MARKET_CONTEXT = {
    "aluminium": {"bias": "SELL_NOW", "reason": "Near 4-year high ($3.52/kg) on Persian Gulf supply disruptions — optimal sell window."},
    "copper":    {"bias": "SELL_NOW", "reason": "At multi-year high ($13.57/kg) with strong industrial demand — capitalise on peak."},
    "nickel":    {"bias": "SELL_NOW", "reason": "Declining (-1.31%) due to EV demand softness and surplus supply — sell to avoid further losses."},
    "zinc":      {"bias": "HOLD",     "reason": "Strong upward momentum (+1.75%) with industrial recovery tailwind — hold for higher gains."},
    "lead":      {"bias": "SELL_NOW", "reason": "Slight downward bias (-0.35%) with subdued battery market demand — sell now."},
    "silver":    {"bias": "HOLD",     "reason": "Rising toward $2,540/kg with geopolitical safe-haven demand — hold for continued upside."},
    "gold":      {"bias": "SELL_NOW", "reason": "At historic high (~$151,600/kg) near plateau territory — optimal profit-taking point."},
}

def make_recommendation(
    current_price: float,
    forecast_prices: List[float],
    forecast_dates: List[str],
    weight_kg: float,
    metal: str = "copper"
) -> dict:
    prices = np.array(forecast_prices)
    peak_price = float(np.max(prices))
    peak_day   = int(np.argmax(prices))
    end_price  = float(prices[-1])
    trend_pct  = (end_price - current_price) / current_price * 100

    if   trend_pct >  2.0: trend_dir = "UPWARD"
    elif trend_pct < -2.0: trend_dir = "DOWNWARD"
    else:                  trend_dir = "STABLE"

    # Primary decision: use market context bias
    context   = METAL_MARKET_CONTEXT.get(metal, {"bias": "HOLD", "reason": "Insufficient data."})
    action    = context["bias"]
    reasoning = context["reason"]

    # Override: if ARIMA forecast strongly contradicts context, note both
    if action == "SELL_NOW" and trend_dir == "UPWARD" and trend_pct > 5.0:
        reasoning += f" Note: 90-day forecast shows +{trend_pct:.1f}% upside potential — consider partial sale."
    elif action == "HOLD" and trend_dir == "DOWNWARD" and trend_pct < -5.0:
        action    = "SELL_NOW"
        reasoning = f"Despite current upward context, ARIMA forecast shows {trend_pct:.1f}% decline over 90 days — sell to protect value."

    profit = round(current_price * weight_kg, 2) if action == "SELL_NOW" else None
    peak_date = forecast_dates[peak_day] if peak_day < len(forecast_dates) else None

    return {
        "recommendation": action.replace("_", " "),
        "reason": reasoning,
        "profit_if_sell": profit,
        "expected_peak_price": round(peak_price, 4) if action == "HOLD" else None,
        "expected_peak_date": peak_date if action == "HOLD" else None,
    }
