import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setCountry(data.country_code);
      } catch (error) {
        console.error('Error fetching country:', error);
        setCountry('US'); // Default to US if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, []);

  const convertPrice = (price, type = 'game') => {
    if (country === 'CL') {
      const rate = type === 'account' ? 1150 : 1000;
      return Math.ceil(price * rate);
    }
    return price;
  };

  const getCurrencySymbol = () => {
    if (country === 'CL') {
      return 'CLP';
    }
    return 'USD';
  };

  return (
    <CurrencyContext.Provider value={{ country, loading, convertPrice, getCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}; 