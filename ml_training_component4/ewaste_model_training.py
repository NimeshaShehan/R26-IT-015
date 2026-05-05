import time # Import the time module
import os, sys, pathlib, warnings, importlib

import numpy  as np
import pandas as pd
import pmdarima as pm # Import pmdarima

from sklearn.preprocessing import MinMaxScaler

from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tools.sm_exceptions import ConvergenceWarning

import tensorflow as tf
from tensorflow.keras.models     import Sequential
from tensorflow.keras.layers     import LSTM, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks  import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam

warnings.filterwarnings("ignore", category=ConvergenceWarning)
warnings.filterwarnings("ignore", category=UserWarning)
tf.get_logger().setLevel("ERROR")

def mape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """
    Mean Absolute Percentage Error.

    We guard against division-by-zero by clipping the denominator to a
    tiny epsilon (1e-8).  Returns a percentage value (e.g. 4.7 means 4.7 %).
    """
    y_true = np.array(y_true, dtype=float).ravel()
    y_pred = np.array(y_pred, dtype=float).ravel()
    mask   = ~(np.isnan(y_true) | np.isnan(y_pred))   # ignore NaN rows
    y_true, y_pred = y_true[mask], y_pred[mask]
    return float(np.mean(np.abs((y_true - y_pred) /
                                np.clip(np.abs(y_true), 1e-8, None))) * 100)


def rmse(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Root Mean Squared Error — same units as the target price."""
    y_true = np.array(y_true, dtype=float).ravel()
    y_pred = np.array(y_pred, dtype=float).ravel()
    mask   = ~(np.isnan(y_true) | np.isnan(y_pred))
    return float(np.sqrt(np.mean((y_true[mask] - y_pred[mask]) ** 2)))


def inverse_price(results: dict, metal: str, scaled: np.ndarray) -> np.ndarray:
    """
    Invert MinMaxScaler on a 1-D array of scaled Price values back to USD.

    Assumes the scaler and n_features are stored in the results dictionary
    under the given metal key.
    """
    scaler = results[metal]["scaler"]
    n_features = results[metal]["n_features"]
    dummy = np.zeros((len(scaled), n_features))
    dummy[:, 0] = np.array(scaled).ravel() # Place scaled values in the first feature column
    return scaler.inverse_transform(dummy)[:, 0]

# Removed _select_arima_order as per user's request to use pmdarima.auto_arima()

def train_arima(results: dict,
                metal:   str,
                forecast_horizon: int = 90) -> dict:
    """
    Fit an ARIMA model using pmdarima.auto_arima on scaled training data and produce:
      • In-sample predictions aligned with the test period (walk-forward)
      • A 90-day out-of-sample forecast beyond the last observed price

    Parameters
    ----------
    results    : dict returned by ewaste_preprocessing.run_pipeline()
    metal      : e.g. "aluminium"

    Returns
    -------
    dict with keys:
        order, test_pred_scaled, test_pred_real,
        forecast_scaled, forecast_real, forecast_dates,
        mape, rmse, fit_obj
    """
    print(f"\n  │─ ARIMA │ {metal} " + "─" * (46 - len(metal)))

    # Get scaled training and testing data
    train_df_scaled = results[metal]["arima_train"]
    test_df_scaled = results[metal]["arima_test"]

    # Extract the scaled price series
    train_series_scaled = train_df_scaled['Price_Scaled'].dropna()
    test_series_scaled = test_df_scaled['Price_Scaled'].dropna()

    # Get original (unscaled) test prices for evaluation
    test_real_original = results[metal]["original_test"]['Price'].dropna().values

    print("| Selecting optimal ARIMA order via auto_arima ...", end=" ", flush=True)
    t0 = time.time()
    # Use pmdarima.auto_arima to find optimal (p,d,q) parameters
    model_auto_arima = pm.auto_arima(train_series_scaled,
                                     start_p=1, start_q=1,
                                     test='adf', # use adftest to find optimal 'd'
                                     max_p=3, max_q=3, # maximum p and q
                                     m=1, # frequency of series (if seasonal)
                                     d=None, # let model determine 'd'
                                     seasonal=False, # No seasonality for daily data here, or if m=1
                                     trace=False, # verbose output
                                     error_action='ignore',  # don't want to know if a run fails
                                     suppress_warnings=True, # don't print warnings
                                     stepwise=True)
    order = model_auto_arima.order
    print(f"best={order} ({time.time()-t0:.1f}s)")

    print(f"| Fitting ARIMA{order} on {len(train_series_scaled):,} scaled training steps ...", end=" ", flush=True)
    t0 = time.time()
    fit = ARIMA(train_series_scaled, order=order).fit(
        method_kwargs={"warn_convergence": False})
    print(f"done ({time.time()-t0:.1f}s) AIC={fit.aic:.2f}")

    # Generate predictions on the scaled test set
    n_test = len(test_series_scaled) # Use actual length of test series
    fc_test_obj = fit.get_forecast(steps=n_test)
    test_pred_scaled = fc_test_obj.predicted_mean.values

    # Generate future forecast on scaled data
    # Fit ARIMA on the full scaled series for future forecasting
    full_series_scaled = pd.concat([train_series_scaled, test_series_scaled])
    print(f"| Fitting final ARIMA{order} on full scaled series for future forecasting ...", end=" ", flush=True)
    t0 = time.time()
    fit_full = ARIMA(full_series_scaled, order=order).fit(
        method_kwargs={"warn_convergence": False})
    print(f"done ({time.time()-t0:.1f}s) AIC={fit_full.aic:.2f}")

    fc_future_obj = fit_full.get_forecast(steps=forecast_horizon)
    forecast_scaled = fc_future_obj.predicted_mean.values
    conf_int_scaled = fc_future_obj.conf_int().values

    # --- Apply inverse scaling to predictions and forecasts ---
    test_pred_real = inverse_price(results, metal, test_pred_scaled)
    forecast_real  = inverse_price(results, metal, forecast_scaled)

    # Get original (unscaled) test prices for evaluation
    test_real_real = test_real_original[:len(test_pred_real)] # Ensure lengths match

    # Inverse scale confidence intervals as well
    conf_lower_real = inverse_price(results, metal, conf_int_scaled[:, 0])
    conf_upper_real = inverse_price(results, metal, conf_int_scaled[:, 1])

    # Ensure forecast dates are generated correctly
    last_date = full_series_scaled.index[-1] if isinstance(full_series_scaled.index, pd.DatetimeIndex) else pd.Timestamp.now().normalize()
    forecast_dates = pd.bdate_range(start=last_date + pd.Timedelta(days=1),
                                    periods=forecast_horizon)

    m = mape(test_real_real, test_pred_real)
    r = rmse(test_real_real, test_pred_real)

    return {
        "order": order,
        "fit_obj": fit_full,
        "test_pred_scaled": test_pred_scaled,
        "test_pred_real": test_pred_real,
        "test_real_real": test_real_real,
        "test_dates": test_df_scaled['Date'].iloc[:len(test_pred_real)], # Ensure dates align with predictions
        "forecast_scaled": forecast_scaled,
        "forecast_real": forecast_real,
        "forecast_dates": forecast_dates,
        "conf_lower_real": conf_lower_real,
        "conf_upper_real": conf_upper_real,
        "mape": m,
        "rmse": r,
    }

def build_lstm_model(window_size: int, n_features: int) -> Sequential:
    model = Sequential([
        LSTM(128,
             return_sequences=True,
             input_shape=(window_size, n_features),
             kernel_regularizer=tf.keras.regularizers.l2(1e-4)),
        BatchNormalization(),
        Dropout(0.2),

        LSTM(64, return_sequences=False),
        Dropout(0.2),

        Dense(1)
    ])

    model.compile(optimizer='adam', loss='mse')
    return model

def build_refined_lstm(window_size: int, n_features: int) -> Sequential:
    model = Sequential([
        LSTM(64,
             return_sequences=False,
             kernel_regularizer=tf.keras.regularizers.l2(1e-4),
             input_shape=(window_size, n_features)),
        BatchNormalization(),
        Dropout(0.2),

        Dense(32, activation="relu"),
        Dense(1, activation="linear", name="LSTM_EWaste")
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='huber',
        metrics=['mae']
    )

    return model

def create_lstm_sequences(data: np.ndarray, window_size: int) -> tuple[np.ndarray, np.ndarray]:
    X, y = [], []
    for i in range(len(data) - window_size):
        X.append(data[i:(i + window_size), :])
        y.append(data[i + window_size, 0])  # Assuming 'Price_Scaled' is the first feature (index 0)
    return np.array(X), np.array(y)

def train_lstm(results: dict,
               metal: str,
               window_size: int,
               forecast_horizon: int,
               epochs: int = 50,
               batch_size: int = 32,
               verbose: bool = True) -> dict:
    print(f"\n  │─ LSTM │ {metal} " + "─" * (46 - len(metal)))

    # Get original (unscaled) train and test dataframes
    # Dataframes are already cleaned and sorted by `run_pipeline`
    df_train_original = results[metal]["original_train"].copy()
    df_test_original = results[metal]["original_test"].copy()

    # Ensure 'Date' column is datetime and sort for original dataframes
    df_train_original['Date'] = pd.to_datetime(df_train_original['Date'], format='mixed', dayfirst=True, errors='coerce')
    df_test_original['Date'] = pd.to_datetime(df_test_original['Date'], format='mixed', dayfirst=True, errors='coerce')

    # Extract scaled data for LSTM sequences
    df_train_scaled = results[metal]["arima_train"].copy()
    df_test_scaled = results[metal]["arima_test"].copy()

    train_scaled = df_train_scaled[['Price_Scaled']].values
    test_scaled = df_test_scaled[['Price_Scaled']].values

    n_features = results[metal]["n_features"] # Should be 1

    # Handle cases where not enough data for sequences
    if len(train_scaled) < window_size + 1: # Need at least window_size + 1 elements to create one sequence
        if verbose:
            print(f"☢• Warning: Not enough training data ({len(train_scaled)} samples) for window_size {window_size}. Skipping LSTM training.")
        return {"mape": np.inf, "rmse": np.inf}

    X_train, y_train = create_lstm_sequences(train_scaled, window_size)
    y_train = y_train.reshape(-1, 1) # Reshape y_train for Keras input

    # Initialize prediction arrays to empty in case test data is insufficient
    test_predictions_scaled = np.array([])
    test_predictions_real = np.array([])
    test_actual_real = np.array([])
    error_std_scaled = 0.0

    # Handle cases where test set is too small for sequences
    if len(test_scaled) < window_size + 1: # Need at least window_size + 1 elements for one test sequence
        if verbose:
            print(f"☢• Warning: Not enough test data ({len(test_scaled)} samples) for window_size {window_size}. Skipping LSTM evaluation.")
        X_test, y_test = np.array([]), np.array([]) # Ensure X_test and y_test are empty numpy arrays
        test_dates_for_summary = pd.DatetimeIndex([])
        has_valid_test_data = False
    else:
        X_test, y_test = create_lstm_sequences(test_scaled, window_size)
        y_test = y_test.reshape(-1, 1) # Reshape y_test for Keras input
        test_dates_for_summary = df_test_original['Date'].iloc[window_size:window_size+len(y_test)] # Align dates
        has_valid_test_data = True

    # Build and compile model
    model = build_refined_lstm(window_size, n_features)

    # Callbacks
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=5, min_lr=0.0001)

    history = None # Initialize history to None

    if len(X_train) > 0:
        if verbose:
            print(f"| Training LSTM model on {len(X_train):,} sequences ...")

        # Dynamically adjust batch_size if it's larger than the number of training sequences
        current_batch_size = min(batch_size, len(X_train))

        fit_kwargs = {
            'epochs': epochs,
            'batch_size': current_batch_size,
            'callbacks': [early_stopping, reduce_lr],
            'verbose': 0
        }
        if has_valid_test_data and len(X_test) > 0:
            fit_kwargs['validation_data'] = (X_test, y_test)
        else:
            # If no valid test data, early stopping on val_loss won't work.
            early_stopping.monitor = 'loss' # Monitor training loss if no validation
            if verbose:
                print("  Note: No valid test data for validation; monitoring training loss.")

        history = model.fit(X_train, y_train, **fit_kwargs)

        if verbose:
            best_metric = min(history.history['val_loss']) if has_valid_test_data else min(history.history['loss'])
            metric_name = 'val_loss' if has_valid_test_data else 'loss'
            print(f"| Training finished. Best {metric_name}: {best_metric:.4f}")

        # Make predictions on the test set if there's valid test data
        if has_valid_test_data and len(X_test) > 0:
            test_predictions_scaled = model.predict(X_test, verbose=0)
            test_predictions_real = inverse_price(results, metal, test_predictions_scaled) # Updated call
            test_actual_real = df_test_original['Price'].iloc[window_size:window_size+len(y_test)].values # Align actuals with predictions

            # Calculate residuals and their standard deviation for confidence intervals
            test_errors_scaled = (y_test - test_predictions_scaled.flatten()[:, np.newaxis])
            error_std_scaled = np.std(test_errors_scaled)
        else:
            if verbose:
                print("| Skipping test predictions due to no valid test data.")

    else:
        if verbose:
            print("| Not enough training data to build LSTM model.")

    # Generate future forecast
    future_forecast_scaled = np.array([])
    future_forecast_real = np.array([])
    conf_lower_real = np.array([])
    conf_upper_real = np.array([])

    last_known_date = pd.Timestamp.now().normalize()

    if history is not None: # Only attempt forecasting if model was trained
        # Determine the last relevant data for forecasting input
        if has_valid_test_data and len(test_scaled) > 0:
            full_data_scaled = np.concatenate((train_scaled, test_scaled))
            last_window = full_data_scaled[-window_size:]
            if not df_test_original.empty:
                last_known_date = df_test_original['Date'].iloc[-1]
            elif not df_train_original.empty:
                last_known_date = df_train_original['Date'].iloc[-1]
        else:
            last_window = train_scaled[-window_size:]
            if not df_train_original.empty:
                last_known_date = df_train_original['Date'].iloc[-1]

        forecast_input = last_window.reshape(1, window_size, n_features)

        future_forecast_scaled_list = []
        current_input = forecast_input

        for _ in range(forecast_horizon):
            next_pred = model.predict(current_input, verbose=0)[0, 0]
            future_forecast_scaled_list.append(next_pred)
            # Update the input window: remove oldest, add new prediction
            current_input = np.roll(current_input, -1, axis=1)
            current_input[0, -1, 0] = next_pred # Assuming Price is at index 0

            future_forecast_scaled = np.array(future_forecast_scaled_list)
            future_forecast_real = inverse_price(results, metal, future_forecast_scaled.reshape(-1, 1)) # Updated call

            # Calculate confidence intervals for the forecast
            conf_lower_scaled = future_forecast_scaled - 1.96 * error_std_scaled
            conf_upper_scaled = future_forecast_scaled + 1.96 * error_std_scaled

            conf_lower_real = inverse_price(results, metal, conf_lower_scaled.reshape(-1, 1)) # Updated call
            conf_upper_real = inverse_price(results, metal, conf_upper_scaled.reshape(-1, 1)) # Updated call

            conf_lower_real = np.clip(conf_lower_real, 0.0, None)
            conf_upper_real = np.clip(conf_upper_real, 0.0, None)
    else:
        if verbose:
            print("| Skipping future forecast due to no model training.")
        # If no training happened, last_known_date might still be the default or from train_original
        if not df_train_original.empty:
            last_known_date = df_train_original['Date'].iloc[-1]


    # Forecast dates
    forecast_dates = pd.bdate_range(start=last_known_date + pd.Timedelta(days=1), periods=forecast_horizon)

    if len(test_actual_real) > 0 and len(test_predictions_real) > 0:
        m = mape(test_actual_real, test_predictions_real)
        r = rmse(test_actual_real, test_predictions_real)
    else:
        m = np.inf # Indicate failure for MAPE if no test data
        r = np.inf # Indicate failure for RMSE if no test data

    return {
        "model": model if history is not None else None,
        "scaler": results[metal]["scaler"],
        "n_features": n_features,
        "X_test": X_test,
        "y_test_scaled": y_test,
        "test_pred_scaled": test_predictions_scaled,
        "test_pred_real": test_predictions_real,
        "test_actual_real": test_actual_real,
        "test_dates": test_dates_for_summary,
        "forecast_scaled": future_forecast_scaled,
        "forecast_real": future_forecast_real,
        "forecast_dates": forecast_dates,
        "conf_lower_real": conf_lower_real,
        "conf_upper_real": conf_upper_real,
        "mape": m,
        "rmse": r,
        "history": history
    }
