import { Pipe, PipeTransform } from '@angular/core';
import {CoinDto} from '../dto/coin-dto';

@Pipe({
  name: 'matchCoin'
})
/**
 * Filters an array of CoinDto by giving the searched coin name or symbol.
 * @see matchAndSortCoins
 * @see filterCoins first
 * @see sortCoinsByLength
 * @see sortCoinsBySymbolSimilarity
 */
export class MatchCoinPipe implements PipeTransform {
  private searchedCoin: string;
  private coins: CoinDto[];
  private matchingCoins: CoinDto[];

  transform(coins: CoinDto[], searchedCoin: string): CoinDto[] {
    this.searchedCoin = searchedCoin;
    this.coins = coins;

    this.matchAndSortCoins();
    if (this.matchingCoins !== null && this.matchingCoins.length > 0){
      return this.matchingCoins;
    }
    else {
      return coins;
    }
  }

  /**
   * Matches and sort the coin list if the length of the searched coin is over 1.
   * @see sortCoinsByLength
   * @method sortCoinsByLength
   */
  private matchAndSortCoins(): void {
    if (this.searchedCoin.length >= 2) {
      this.filterCoins();
      this.sortCoinsByLength();
      this.sortCoinsBySymbolSimilarity();
    }
  }

  /**
   * Sort the coins by their symbol's similarity with the searched coin.
   */
  private sortCoinsBySymbolSimilarity(): void {
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
  private filterCoins(): void {
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
  private sortCoinsByLength(): void {
    this.matchingCoins.sort((a, b) => a.name.length - b.name.length);
  }
}
