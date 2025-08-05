import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { getCurrencyData, CountryCurrencyData } from '@/lib/CountryCurrency';

interface FlutterwavePaymentProps {
  email: string;
  name: string;
  courseId: string;
  courseName: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({
  email,
  name,
  courseId,
  courseName,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState<CountryCurrencyData | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Get user's country and currency data
    const fetchCurrencyData = async () => {
      try {
        const response = await fetch('/api/user/country');
        const { countryCode } = await response.json();
        const data = getCurrencyData(countryCode);
        setCurrencyData(data);
      } catch (error) {
        console.error('Error fetching currency data:', error);
        // Default to NGN if there's an error
        setCurrencyData(getCurrencyData('NG'));
      }
    };

    fetchCurrencyData();
  }, []);

  const handlePayment = async () => {
    if (!currencyData) {
      toast.error('Unable to determine payment currency');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a payment session
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          courseId,
          courseName,
          amount: currencyData.amount,
          currency: currencyData.code
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create payment session');
      }
      
      const data = await response.json();
      
      // Set the Flutterwave configuration
      setConfig({
        ...data.flutterwaveConfig,
        onClose: () => {
          closePaymentModal();
          setIsLoading(false);
        },
        callback: (response: any) => {
          if (response.status === 'successful') {
            onSuccess();
          } else {
            onError(new Error('Payment failed'));
          }
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      onError(error);
      setIsLoading(false);
    }
  };

  // Initialize Flutterwave payment when config is set
  const initializePayment = useFlutterwave(config || {});

  if (!currencyData) {
    return (
      <button
        disabled
        className="inline-block text-white bg-gray-400 px-6 py-3 rounded-md cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="inline-block text-white bg-green-600 px-6 py-3 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
    >
      {isLoading ? 'Processing...' : `Enroll Now - ${currencyData.symbol}${currencyData.amount.toLocaleString()}`}
    </button>
  );
};

export default FlutterwavePayment; 