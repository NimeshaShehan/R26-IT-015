import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getMarketPrices } from '../services/api';
import useSilentRefresh from '../hooks/useSilentRefresh';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [prevPrices, setPrevPrices] = useState([]);

  const fetchPrices = useCallback(() => getMarketPrices(), []);
  const { data: priceData } = useSilentRefresh(fetchPrices, 5000);

  useEffect(() => {
    if (priceData?.prices) {
      if (prevPrices.length > 0) {
        priceData.prices.forEach(newMetal => {
          const oldMetal = prevPrices.find(m => m.metal === newMetal.metal);
          if (oldMetal && oldMetal.recommendation !== newMetal.recommendation) {
            const msg = `${newMetal.label} recommendation changed: ${oldMetal.recommendation} to ${newMetal.recommendation}`;
            setNotifications(prev => [{ id: Date.now() + Math.random(), msg, time: new Date() }, ...prev]);
            toast.success(msg, { icon: '📈' });
          }
        });
      }
      setPrevPrices(priceData.prices);
    }
  }, [priceData]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, priceData }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
