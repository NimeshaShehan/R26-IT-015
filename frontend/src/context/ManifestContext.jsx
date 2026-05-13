import { createContext, useContext, useState } from 'react';

const ManifestContext = createContext();

export function ManifestProvider({ children }) {
  const [manifestData, setManifestData] = useState(null);
  const [forecastData, setForecastData] = useState(null); // last financial forecast result

  return (
    <ManifestContext.Provider value={{ manifestData, setManifestData, forecastData, setForecastData }}>
      {children}
    </ManifestContext.Provider>
  );
}

export const useManifest = () => useContext(ManifestContext);
