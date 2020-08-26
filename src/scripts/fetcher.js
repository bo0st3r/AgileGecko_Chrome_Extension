// Fetches the coin list from CoinGecko
function fetchCoinList(){
  (async () => {
    const response = await fetch( 'https://api.coingecko.com/api/v3/coins/list', {} );
    const data = await response.json();
    localStorage.setItem('coinGeckoCoins', JSON.stringify(data));
    console.log(data)
  })();
}

// Focuses on the coin search input
function focusOnCoinSearch(){
  window.onload = (event) => {
    console.log('loadeed')
    document.getElementById("coin-searched").focus();
  }
}

if(!localStorage.getItem('coinGeckoCoins')){
  fetchCoinList();
}
focusOnCoinSearch();

