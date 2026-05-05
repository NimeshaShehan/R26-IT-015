import pathlib
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# Global dictionary for the notebook to access
DAILY_FILES = {
    "aluminium": pathlib.Path("Aluminium Historical Data.csv"),
    "copper": pathlib.Path("Copper Historical Data.csv"),
    "lead": pathlib.Path("Lead Historical Data.csv"),
    "nickel": pathlib.Path("Nickel Historical Data.csv"),
    "zinc": pathlib.Path("Zinc Historical Data.csv"),
    "silver": pathlib.Path("Silver Historical Data.csv"),
    "gold": pathlib.Path("Refined Gold Historical Data.csv"),
    "steel": pathlib.Path("Steel Scrap Futures Historical Data.csv")
}

def run_pipeline(window_size=60, train_ratio=0.8, verbose=True):
    processed_results = {}

    if verbose:
        print(f"--- Initializing pipeline: window={window_size}, ratio={train_ratio} ---")

    # Define actual data directory
    data_dir = pathlib.Path("/content/ewaste_data")

    for metal, filename_path_obj in DAILY_FILES.items():
        file_path = data_dir / filename_path_obj.name

        if file_path.exists():
            # Load actual CSV data
            df = pd.read_csv(file_path)

            if metal == "steel" and verbose:
                print(f"  [DEBUG {metal}] Initial DataFrame shape: {df.shape}")
                print(f"  [DEBUG {metal}] Initial DataFrame columns: {df.columns.tolist()}")

            # Ensure 'Date' column is datetime and sort
            if 'Date' in df.columns:
                # Use explicit format for Investing.com dates (e.g., 'Oct 29, 2025')
                # For other files, 'mixed' could be used, but for specific new 'Steel' file, this is more robust.
                if metal == "steel":
                    df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%Y', errors='coerce') # FIX: Changed format for steel
                else:
                    df['Date'] = pd.to_datetime(df['Date'], dayfirst=True, format='mixed', errors='coerce')

                df = df.dropna(subset=['Date']).sort_values(by='Date').reset_index(drop=True)
                if metal == "steel" and verbose:
                    print(f"  [DEBUG {metal}] After Date parsing and dropna, DataFrame shape: {df.shape}")
                    if df.empty:
                        print(f"  [DEBUG {metal}] DataFrame is empty after date processing.")
            else:
                if verbose:
                    print(f"  Warning: 'Date' column not found in {filename_path_obj.name}")
                continue # Skip this metal if no Date column

            # Convert 'Price' column to numeric, handling commas and coercing errors
            df['Price'] = pd.to_numeric(df['Price'].astype(str).str.replace(',', ''), errors='coerce')
            if metal == "steel" and verbose:
                print(f"  [DEBUG {metal}] After Price conversion, DataFrame shape: {df.shape}")

            # Interpolate missing price values before dropping any remaining NaNs
            df['Price'].interpolate(method='linear', inplace=True)
            df.dropna(subset=['Price'], inplace=True) # Drop any remaining NaNs after interpolation

            # If no data left after cleaning, skip
            if df.empty:
                if verbose:
                    print(f"  Warning: No valid price data for {filename_path_obj.name}")
                continue
            if metal == "steel" and verbose:
                print(f"  [DEBUG {metal}] After Price interpolation and dropna, DataFrame shape: {df.shape}")

            # Fill any other missing values with forward fill (e.g., Vol. or Change %)
            df.fillna(method='ffill', inplace=True)
            df.fillna(method='bfill', inplace=True) # Backward fill for any leading NaNs if necessary

            # Fit scaler on the entire 'Price' column
            scaler = MinMaxScaler(feature_range=(0, 1))
            df['Price_Scaled'] = scaler.fit_transform(df[['Price']])
            n_features = 1 # Only 'Price' is being scaled here

            # Simple split logic for your ARIMA/LSTM sets
            split_idx = int(len(df) * train_ratio)

            # Store both original and scaled data, plus the scaler and n_features
            processed_results[metal] = {
                "original_train": df.iloc[:split_idx].copy(),
                "original_test":  df.iloc[split_idx:].copy(),
                "arima_train": df.iloc[:split_idx][['Date', 'Price_Scaled']].copy(), # ARIMA will use scaled data
                "arima_test":  df.iloc[split_idx:][['Date', 'Price_Scaled']].copy(),  # ARIMA will use scaled data
                "scaler": scaler,
                "n_features": n_features
            }
            if metal == "steel" and verbose:
                print(f"  [DEBUG {metal}] Successfully processed and added to results.")
        elif verbose:
            print(f"⚠️ Warning: {filename_path_obj.name} not found in {data_dir}")

    return processed_results
