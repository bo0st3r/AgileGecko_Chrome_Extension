import {Component, OnInit} from '@angular/core';
import {CoinDto} from '../../../coingecko/dto/coin-dto';
import {timer} from 'rxjs';

@Component({
  selector: 'app-extension-tab',
  templateUrl: './extension-tab.component.html',
  styleUrls: ['./extension-tab.component.css']
})
export class ExtensionTabComponent implements OnInit {
  public COIN_PREFIX = 'https://www.coingecko.com/en/coins/';
  public coins: CoinDto[];
  public searchedCoin = '';

  public matchingCoins: CoinDto[];

  constructor() {
  }

  ngOnInit(): void {
    // Tries to retrieve the coins list from the localStorage every 200ms until done
    const delay = timer(0, 200);
    const fetchCoinsSub = delay.subscribe(() => {
      if (this.coinListExists()) {
        this.coins = this.retrieveCoinList();
        fetchCoinsSub.unsubscribe();
      }
    });
  }

  /**
   * Matches and sort the coin list if @
   * @see sortCoinsByLength
   * @method sortCoinsByLength  a
   */
  public matchAndSortCoins(): void {
    if (this.searchedCoin.length >= 2) {
      this.filterCoins();

      if (this.matchingCoins.length > 3) {
        this.sortCoinsByLength();
      }
      this.sortCoinsBySymbolSimilarity();
    }
  }

  public openCoinTab(coinId: string): void {
    chrome.tabs.create({url: this.COIN_PREFIX + coinId}, () => {
    });
  }

  // Sort the coins from shortest to longer if more than 3 entries
  private sortCoinsByLength(): void {
    this.matchingCoins.sort((a, b) => a.name.length - b.name.length);
  }

  // Sort the coins by their symbol's similarity with the searched coin
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

  private filterCoins(): void {
    this.matchingCoins = this.coins.filter(coin => {
      const searchedCoinLowered = this.searchedCoin.toLowerCase();
      const nameLowered = coin.name.toLowerCase();
      const symbolLowered = coin.symbol.toLowerCase();
      return nameLowered.includes(searchedCoinLowered) || symbolLowered.includes(searchedCoinLowered);
    });
  }

  private coinListExists(): boolean {
    return this.retrieveCoinList() != null;
  }

  private retrieveCoinList(): CoinDto[] {
    return JSON.parse(localStorage.getItem('coinGeckoCoins'));
  }
}
