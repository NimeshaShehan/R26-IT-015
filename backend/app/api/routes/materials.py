"""
Component 3 - GET /materials route - Version 2
14 MSW (Municipal Solid Waste) Materials
"""

from fastapi import APIRouter

router = APIRouter()

MATERIALS = [
    # Paper & Cardboard - Mechanical
    { "name": "Newspapers",         "waste_type": "Organic", "category": "Paper",   "toxicity": "Low",    "method": "Mechanical" },
    { "name": "Cardboard Boxes",    "waste_type": "Organic", "category": "Paper",   "toxicity": "Low",    "method": "Mechanical" },
    { "name": "Office Paper",       "waste_type": "Organic", "category": "Paper",   "toxicity": "Low",    "method": "Mechanical" },
    # Plastics - Thermal
    { "name": "PET Water Bottles",  "waste_type": "Plastic", "category": "Plastic", "toxicity": "Low",    "method": "Thermal"    },
    { "name": "Food Containers",    "waste_type": "Plastic", "category": "Plastic", "toxicity": "Low",    "method": "Thermal"    },
    { "name": "Plastic Bags",       "waste_type": "Plastic", "category": "Plastic", "toxicity": "Low",    "method": "Thermal"    },
    # Glass - Mechanical
    { "name": "Glass Bottles",      "waste_type": "Glass",   "category": "Glass",   "toxicity": "Low",    "method": "Mechanical" },
    { "name": "Glass Jars",         "waste_type": "Glass",   "category": "Glass",   "toxicity": "Low",    "method": "Mechanical" },
    # Textiles - Mechanical
    { "name": "Old Clothes",        "waste_type": "Organic", "category": "Textile", "toxicity": "Low",    "method": "Mechanical" },
    { "name": "Fabric Scraps",      "waste_type": "Organic", "category": "Textile", "toxicity": "Low",    "method": "Mechanical" },
    # Rubber - Thermal
    { "name": "Old Tires",          "waste_type": "Rubber",  "category": "Rubber",  "toxicity": "Medium", "method": "Thermal"    },
    { "name": "Rubber Footwear",    "waste_type": "Rubber",  "category": "Rubber",  "toxicity": "Low",    "method": "Thermal"    },
    # Wood - Mechanical
    { "name": "Wooden Pallets",     "waste_type": "Organic", "category": "Wood",    "toxicity": "Low",    "method": "Mechanical" },
    { "name": "Furniture Scraps",   "waste_type": "Organic", "category": "Wood",    "toxicity": "Low",    "method": "Mechanical" },
]


@router.get("/materials")
def get_materials():
    return { "total": len(MATERIALS), "materials": MATERIALS }
