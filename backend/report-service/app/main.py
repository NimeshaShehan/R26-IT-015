from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Load from .env
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["ewaste_db"]
collection = db["reports"]

# Request model
class Report(BaseModel):
    district: str
    item_type: str
    quantity: int

# Create report
@app.post("/report")
def create_report(data: Report):
    report_dict = data.dict()

    result = collection.insert_one(report_dict)

    return {
        "message": "Report saved to database",
        "inserted_id": str(result.inserted_id)  # convert ObjectId → string
    }
# Get all reports
@app.get("/reports")
def get_reports():
    data = list(collection.find({}, {"_id": 0}))
    return data

@app.get("/")
def root():
    return {"message": "Report Service Running with DB"}