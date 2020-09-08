const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/';
const COINGECKO_COINS_KEY = 'coinGeckoCoins';

// Fetches the coin list from CoinGecko
function fetchCoinList() {
  (async () => {
    const response = await fetch(COINGECKO_API_URL + 'coins/list', {});
    const data = await response.json();
    const dataJson = JSON.stringify(data);
    localStorage.setItem(COINGECKO_COINS_KEY, dataJson);
  })();
}

// At startup, always fetches the fresh list of coins
fetchCoinList();

