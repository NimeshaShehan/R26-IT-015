# Data Preprocessing

## Steps Performed

1. Removed metadata rows from World Bank datasets
2. Converted wide format → long format using melt()
3. Filtered only Sri Lanka data
4. Renamed columns for consistency
5. Merged datasets using Year and Country
6. Handled missing values using forward fill (ffill)

## Important Decision

- Missing year (2018) was filled using forward fill to maintain time-series continuity

## Final Dataset

Columns:
- Year
- GDP
- Imports
- E_waste_MT