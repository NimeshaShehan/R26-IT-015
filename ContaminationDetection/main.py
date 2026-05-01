from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model import load_model, predict_grade

app = FastAPI(title="Contamination Detection API")

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
    return {"service": "Contamination Detection", "status": "running"}

@app.post("/api/contamination/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    result = predict_grade(contents)
    return {
        "filename": file.filename,
        "grade": result["grade"],
        "label": result["label"],
        "action": result["action"],
        "confidence": result["confidence"],
        "color": result["color"]
    }