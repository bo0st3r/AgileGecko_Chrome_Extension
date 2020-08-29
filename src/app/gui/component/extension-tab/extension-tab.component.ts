import {Component, OnInit} from '@angular/core';
import {CoinDto} from '../../../coingecko/dto/coin-dto';
import {timer} from 'rxjs';

@Component({
  selector: 'app-extension-tab',
  templateUrl: './extension-tab.component.html',
  styleUrls: ['./extension-tab.component.css']
})
export class ExtensionTabComponent implements OnInit {
  private COIN_PREFIX = 'https://www.coingecko.com/en/coins/';
  private TIMER_DELAY_MS = 20;

  public coins: CoinDto[] = new Array();

  public searchedCoin = '';
  public matchingCoins: CoinDto[] = new Array();

  constructor() {}

  ngOnInit(): void {
    // Tries to retrieve the coins list from the localStorage every 200ms until done
    const delay = timer(0, this.TIMER_DELAY_MS);
    const fetchCoinsSub = delay.subscribe(() => {
      console.log('check');
      if (this.coinListExists()) {
        this.coins = this.retrieveCoinList();
        fetchCoinsSub.unsubscribe();
      }
    });
  }

  /**
   * Opens a new tab in the explorer by using the given coinId.
   * @param coinId ID of the coin to consult
   */
  public openCoinTab(coinId: string): void {
    chrome.tabs.create({url: this.COIN_PREFIX + coinId}, () => {
    });
  }

  /**
   * Verifies if @valu
   */
  private coinListExists(): boolean {
    return this.retrieveCoinList().length > 0;
  }

  /**
   * Retrieves the coin list from localStorage at 'coinGeckoCoins' key.
   */
  private retrieveCoinList(): CoinDto[] {
    return JSON.parse(localStorage.getItem('coinGeckoCoins'));
  }
}
