export interface CountryCurrencyData {
  country: string;
  currency: string;
  code: string;
  symbol: string;
  amount: number;
}

export const countryCurrencyData: CountryCurrencyData[] = [
  {
    country: "Nigeria",
    currency: "Nigerian Naira",
    code: "NGN",
    symbol: "₦",
    amount: 50000,
  },
  {
    country: "Ghana",
    currency: "Ghanaian Cedi",
    code: "GHS",
    symbol: "₵",
    amount: 500,
  },
  {
    country: "Kenya",
    currency: "Kenyan Shilling",
    code: "KES",
    symbol: "KSh",
    amount: 15000,
  },
  {
    country: "South Africa",
    currency: "South African Rand",
    code: "ZAR",
    symbol: "R",
    amount: 1000,
  },
  {
    country: "United States",
    currency: "US Dollar",
    code: "USD",
    symbol: "$",
    amount: 50,
  },
  {
    country: "United Kingdom",
    currency: "British Pound",
    code: "GBP",
    symbol: "£",
    amount: 40,
  },
  {
    country: "European Union",
    currency: "Euro",
    code: "EUR",
    symbol: "€",
    amount: 45,
  },
];

// Helper function to get currency data for a country
export const getCurrencyData = (countryCode: string): CountryCurrencyData => {
  return (
    countryCurrencyData.find((data) => data.code === countryCode) ||
    countryCurrencyData[0]
  ); // Default to the first item if country not found
};

const countryCurrency = {
  countryCurrencyData,
  getCurrencyData,
};

export default countryCurrency;
