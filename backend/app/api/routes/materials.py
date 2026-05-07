"""
Component 3 - GET /materials route
Returns all supported materials list
"""

from fastapi import APIRouter

router = APIRouter()

MATERIALS = [
    { "name": "Aluminum",             "waste_type": "Metal",    "category": "Metal",    "toxicity": "Low"    },
    { "name": "Steel",                "waste_type": "Metal",    "category": "Metal",    "toxicity": "Low"    },
    { "name": "Scrap Steel",          "waste_type": "Metal",    "category": "Metal",    "toxicity": "Low"    },
    { "name": "Sheet Metal",          "waste_type": "Metal",    "category": "Metal",    "toxicity": "Low"    },
    { "name": "Lead-Based Alloy",     "waste_type": "Metal",    "category": "Metal",    "toxicity": "High"   },
    { "name": "Polypropylene",        "waste_type": "Plastic",  "category": "Plastic",  "toxicity": "Low"    },
    { "name": "Plastic Resin",        "waste_type": "Plastic",  "category": "Plastic",  "toxicity": "Low"    },
    { "name": "Reprocessed Plastics", "waste_type": "Plastic",  "category": "Plastic",  "toxicity": "Low"    },
    { "name": "Packaging",            "waste_type": "Plastic",  "category": "Plastic",  "toxicity": "Low"    },
    { "name": "Circuit Board",        "waste_type": "E-waste",  "category": "E-waste",  "toxicity": "High"   },
    { "name": "Machine Component",    "waste_type": "E-waste",  "category": "E-waste",  "toxicity": "Medium" },
    { "name": "Cotton",               "waste_type": "Organic",  "category": "Organic",  "toxicity": "Low"    },
    { "name": "Textiles",             "waste_type": "Organic",  "category": "Organic",  "toxicity": "Low"    },
    { "name": "Solvent",              "waste_type": "Chemical", "category": "Chemical", "toxicity": "High"   },
    { "name": "Industrial Oil",       "waste_type": "Chemical", "category": "Chemical", "toxicity": "Medium" },
    { "name": "Coolant",              "waste_type": "Chemical", "category": "Chemical", "toxicity": "Medium" },
    { "name": "Catalyst",             "waste_type": "Chemical", "category": "Chemical", "toxicity": "Medium" },
]


@router.get("/materials")
def get_materials():
    """Return all supported materials list."""
    return {
        "total"    : len(MATERIALS),
        "materials": MATERIALS
    }