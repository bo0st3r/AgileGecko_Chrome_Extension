import {Component, OnInit} from '@angular/core';
import {CoinDto} from '../../../coingecko/dto/coin-dto';
import {timer} from 'rxjs';
import {TabManagerService} from '../../../chrome/util/tab-manager.service';
import {MatchCoinPipe} from '../../../coingecko/pipe/matching-coin.pipe';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-extension-tab',
  templateUrl: './extension-tab.component.html',
  styleUrls: ['./extension-tab.component.css']
})
export class ExtensionTabComponent implements OnInit {
  private TIMER_DELAY_MS = 20;
  public COIN_PREFIX = 'https://www.coingecko.com/en/coins/';
  public CHARTEX_PREFIX = 'https://chartex.pro/?symbol=UNISWAP:';

  public coins: CoinDto[] = new Array();
  public searchedCoin = '';

  constructor(
    public tabManagerService: TabManagerService,
    public matchingCoinPipe: MatchCoinPipe
  ) {}

  ngOnInit(): void {
    this.devStuff();

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
   * If dev. env.:
   * Set 'searchedCoin' value as 'btc'.
   */
  private devStuff(): void {
    if (!environment.production){
      this.searchedCoin = 'btc';
    }
  }

  /**
   * Returns the id of the first coin matching from the list of matching coins given by MatchingCoinPipe.
   * @see MatchCoinPipe
   */
  public firstMatchingCoinID(): string {
    if (this.coins && this.coins.length > 0){
      return this.matchingCoinPipe.transform(this.coins, this.searchedCoin)[0].id;
    }
  }

  /**
   * Verifies if the coins list is already stored in localStorage and has at least 1 element.
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
