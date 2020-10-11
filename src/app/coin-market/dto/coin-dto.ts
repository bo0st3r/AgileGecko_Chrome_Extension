/**
 * Represents a cryptocurrency coin from CoinGecko.
 * @see id
 * @see symbol
 * @see name
 */
export interface CoinDto {
  /**
   * Id of the coin.
   * Can be used to access the coin's page on CoinGecko.
   */
  id: string;
  /**
   * The ticker of the symbol, e.g.: BTC for Bitcoin
   */
  symbol: string;
  /**
   * The name of the coin, e.g.: Ethereum.
   */
  name: string;
}
