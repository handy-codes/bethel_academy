// Country pricing and currency for Flutterwave-supported countries, UK, US, etc.
// Add or update as needed

export interface CountryPricing {
  currency: string;
  amount: number;
}
// Techxos reaches 23 Flutterwave supported Countries
// who can pay in their local currencies
export const countryPricing: Record<string, CountryPricing> = {
  NG: { currency: "NGN", amount: 150000 }, // Nigeria
  KE: { currency: "KES", amount: 4500 }, // Kenya
  GH: { currency: "GHS", amount: 1065 }, // Ghana
  ZA: { currency: "ZAR", amount: 1800 }, // South Africa
  UG: { currency: "UGX", amount: 369000 }, // Uganda
  TZ: { currency: "TZS", amount: 90000 }, // Tanzania
  RW: { currency: "RWF", amount: 50000 }, // Rwanda
  CM: { currency: "XAF", amount: 21000 }, // Cameroon (CFA Franc)
  CI: { currency: "XOF", amount: 60000 }, // Côte d'Ivoire (CFA Franc)
  SN: { currency: "XOF", amount: 60000 }, // Senegal (CFA Franc)
  GM: { currency: "GMD", amount: 2600 }, // Gambia
  MZ: { currency: "MZN", amount: 2300 }, // Mozambique
  ZM: { currency: "ZMW", amount: 1000 }, // Zambia
  SL: { currency: "SLL", amount: 500000 }, // Sierra Leone REDUCED FROM 800000
  MW: { currency: "MWK", amount: 60000 }, // Malawi
  EG: { currency: "EGP", amount: 1800 }, // Egypt
  ET: { currency: "ETB", amount: 4800 }, // Ethiopia
  GN: { currency: "GNF", amount: 1200000 }, // Guinea
  BF: { currency: "XOF", amount: 60000 }, // Burkina Faso
  DZ: { currency: "DZD", amount: 14100 }, // Algeria
  BI: { currency: "BIF", amount: 309000 }, // Burundi
  TD: { currency: "XAF", amount: 63000 }, // Chad
  CG: { currency: "CDF", amount: 300000 }, // DR Congo
  BJ: { currency: "XOF", amount: 60000 }, // Benin
  ML: { currency: "XOF", amount: 60000 }, // Mali
  NE: { currency: "XOF", amount: 60000 }, // Niger
  GA: { currency: "XAF", amount: 63000 }, // Gabon
  MU: { currency: "MUR", amount: 4800 }, // Mauritus
  TG: { currency: "XOF", amount: 60000 }, // Togo
  TN: { currency: "TND", amount: 300 }, // Tunisia
  UK: { currency: "GBP", amount: 120 }, // United Kingdom
  GB: { currency: "GBP", amount: 120 }, // United Kingdom (alt code)
  US: { currency: "USD", amount: 150 }, // United States
};

export const defaultPricing: CountryPricing = {
  currency: "USD",
  amount: 34,
};
