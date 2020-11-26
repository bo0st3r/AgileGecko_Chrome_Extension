import {Pipe, PipeTransform} from '@angular/core';
import {CoinDto} from '../dto/coin-dto';

@Pipe({
  name: 'filterCoins'
})
/**
 * Filters an array of CoinDto by giving the searched coin name or symbol.
 * @see matchAndSort
 * @see filter first
 * @see sortByLength
 * @see sortBySymbolSimilarity
 */
export class FilterCoinsPipe implements PipeTransform {
  private searchedCoin: string;
  private coins: CoinDto[];
  private matchingCoins: CoinDto[];

  /**
   * Filters and sort coins to match the searched coin.
   * If nothing is found, returns an empty Array.
   * @param coins list of coins to filter and sort
   * @param searchedCoin name or symbol of the coin to search for
   */
  public transform(coins: CoinDto[], searchedCoin: string): CoinDto[] {
    this.searchedCoin = searchedCoin;
    this.coins = coins;

    this.matchAndSort();

    if (this.matchingCoins !== null && this.matchingCoins.length > 0) {
      return this.matchingCoins;
    } else {
      return new Array<CoinDto>();
    }
  }

  /**
   * Matches and sort the coin list if the length of the searched coin is over 1.
   * @see sortByLength
   * @method sortCoinsByLength
   */
  private matchAndSort(): void {
    if (this.searchedCoin.length >= 0) {
      this.filter();
      this.sortByLength();
      this.sortBySymbolSimilarity();
    }
  }

  /**
   * Sort the coins by their symbol's similarity with the searched coin.
   */
  private sortBySymbolSimilarity(): void {
    this.matchingCoins.sort((a, b) => {
      const loweredSearchedCoin = this.searchedCoin.toLowerCase();
      if (a.symbol.toLowerCase() === loweredSearchedCoin) {
        return -1;
      } else if (b.symbol.toLowerCase() === loweredSearchedCoin) {
        return 1;
      }
      return 0;
    });
  }

  /**
   * Filters the coins by allowing searches by either name or symbol, all at lower case.
   */
  private filter(): void {
    this.matchingCoins = this.coins.filter(coin => {
      const searchedCoinLowered = this.searchedCoin.toLowerCase();
      const nameLowered = coin.name.toLowerCase();
      const symbolLowered = coin.symbol.toLowerCase();
      return nameLowered.includes(searchedCoinLowered) || symbolLowered.includes(searchedCoinLowered);
    });
  }

  /**
   * Sort the coins from shortest to longer if more than 3 entries
   */
  private sortByLength(): void {
    this.matchingCoins.sort((a, b) => a.name.length - b.name.length);
  }
}
