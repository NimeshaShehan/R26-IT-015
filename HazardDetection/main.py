from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model import load_model, analyze_hazard

app = FastAPI(title="Hazard Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    load_model()

@app.get("/")
def root():
    return {"service": "Hazard Detection", "status": "running"}

@app.post("/api/hazard/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    result = analyze_hazard(contents)
    return result