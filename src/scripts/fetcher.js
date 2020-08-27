const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/';

// Fetches the coin list from CoinGecko
function fetchCoinList() {
  (async () => {
    const response = await fetch(COINGECKO_API_URL + 'coins/list', {});
    const data = await response.json();
    localStorage.setItem('coinGeckoCoins', JSON.stringify(data));
    console.log(data)
  })();
}

console.log('hey fetcher')
// Startup
if (!localStorage.getItem('coinGeckoCoins')) {
  fetchCoinList();
}

