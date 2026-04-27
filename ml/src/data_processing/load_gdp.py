from pathlib import Path

import pandas as pd


RAW_GDP_PATH = Path("data/raw/gdp.csv")


def load_sri_lanka_gdp(csv_path: str | Path = RAW_GDP_PATH) -> pd.DataFrame:
    """Load Sri Lanka GDP per-capita data and reshape it to long format."""
    df = pd.read_csv(csv_path, skiprows=4)

    df = df[df["Country Name"] == "Sri Lanka"].copy()
    df = df.drop(columns=["Country Code", "Indicator Name", "Indicator Code"])

    df_long = df.melt(id_vars=["Country Name"], var_name="Year", value_name="GDP")
    df_long = df_long.rename(columns={"Country Name": "Country"})

    df_long["Year"] = pd.to_numeric(df_long["Year"], errors="coerce")
    df_long["GDP"] = pd.to_numeric(df_long["GDP"], errors="coerce")

    df_long = df_long.dropna(subset=["Year", "GDP"]).copy()
    df_long["Year"] = df_long["Year"].astype(int)

    return df_long.sort_values("Year").reset_index(drop=True)


if __name__ == "__main__":
    df_long = load_sri_lanka_gdp()
    print(df_long.head())
