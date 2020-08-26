if(!localStorage.getItem('coinGeckoCoins')){
  console.log("unset");
  (async () => {
    const response = await fetch( 'https://api.coingecko.com/api/v3/coins/list', {} );
    const data = await response.json();
    localStorage.setItem('coinGeckoCoins', JSON.stringify(data));
    console.log(data)
  })();
}

