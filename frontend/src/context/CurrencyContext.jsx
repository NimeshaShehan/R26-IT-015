import { createContext, useContext, useState } from 'react';
const CurrencyContext = createContext();
// Exchange rate: 1 USD = 325 LKR (update periodically — use a fixed rate since no live forex API is wired)
export const USD_TO_LKR = 325;
export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'LKR'
  const convert = (usdValue) => currency === 'LKR' ? usdValue * USD_TO_LKR : usdValue;
  const format = (usdValue, decimals = 2) => {
    const val = convert(usdValue);
    const prefix = currency === 'USD' ? '$' : 'Rs. ';
    return `${prefix}${val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  };
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format, USD_TO_LKR }}>
      {children}
    </CurrencyContext.Provider>
  );
}
export const useCurrency = () => useContext(CurrencyContext);
