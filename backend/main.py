from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import forecast, disposition

app = FastAPI(
    title="EcoVision — Smart Valuation & Material Routing",
    version="1.0.0",
    description="Smart Valuation & Material Routing - Predictive dashboard for e-waste recycling facilities"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router, prefix="/api/forecast", tags=["Financial Forecast"])
app.include_router(disposition.router, prefix="/api/disposition", tags=["Strategic Disposition"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "component": "Smart Valuation & Material Routing - EWaste Dashboard"}
