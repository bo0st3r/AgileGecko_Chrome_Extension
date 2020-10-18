/**
 * Index page
 */
const HOST = 'https://www.coingecko.com/';

/**
 * CoinGecko's website coins pages prefix.
 */
const TABS = {
  COIN_PAGE: HOST + 'en/coins/',
};

/**
 * API entry point
 */
const API = 'https://api.coingecko.com/api/v3/';

/**
 * API endpoints
 */
const ENDPOINTS = {
  COINS_LIST: API + 'coins/list',
  COINS_MARKETS: API + 'coins/markets',
};

export const coingecko = {
  HOST,
  TABS,
  ENDPOINTS,
  API
};

