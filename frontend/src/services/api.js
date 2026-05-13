import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({ baseURL: BASE_URL });

// Financial Forecast
export const getMetals = () => api.get('/forecast/metals');
export const getCurrentPrices = () => api.get('/forecast/current-prices');
export const getMarketPrices = () => api.get('/forecast/market-prices').then(r => r.data);
export const checkHealth = () => api.get('/health');
export const predictForecast = (metal, weightKg) =>
  api.post('/forecast/predict', { metal, weight_kg: weightKg });

// Strategic Disposition
export const getWasteTypes = () => api.get('/disposition/waste-types');
export const calculateDisposition = (wasteType, weightKg, facilityName) =>
  api.post('/disposition/calculate', {
    waste_type: wasteType,
    weight_kg: weightKg,
    facility_name: facilityName,
  });

// PDF Download — triggers browser download
export const downloadManifestPDF = async (wasteType, weightKg, facilityName) => {
  const response = await api.post(
    '/disposition/manifest/pdf',
    { waste_type: wasteType, weight_kg: weightKg, facility_name: facilityName },
    { responseType: 'blob' }
  );
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `TonnageManifest_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// JSON Export — triggers browser download
export const exportManifestJSON = async (wasteType, weightKg, facilityName) => {
  const response = await api.post(
    '/disposition/manifest/json',
    { waste_type: wasteType, weight_kg: weightKg, facility_name: facilityName },
    { responseType: 'blob' }
  );
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `TonnageManifest_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
