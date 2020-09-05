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
  /**
   * Time in ms between 2 calls  of the localStorage for {@link retrieveCoinList}.
   */
  private TIMER_DELAY_MS = 20;
  /**
   * CoinGecko's coins pages prefix.
   */
  public COIN_PREFIX = 'https://www.coingecko.com/en/coins/';
  /**
   * ChartEx's pair pages prefix.
   */
  public CHARTEX_PREFIX = 'https://chartex.pro/?symbol=UNISWAP:';

  /**
   * List of coins retrieved from the localStorage by using {@link retrieveCoinList}.
   */
  public coins: CoinDto[] = new Array();
  /**
   * Name or symbol of the searched coin.
   */
  public searchedCoin = '';

  /**
   * List of coins matching {@link searchedCoin} within {@link coins}.
   */
  public matchingCoins: CoinDto[];
  /**
   * Index of the selected coin in the HTML's table.
   */
  public indexSelectedMatchingCoins = 0;

  constructor(
    public tabManagerService: TabManagerService,
    public matchingCoinPipe: MatchCoinPipe
  ) {}

  ngOnInit(): void {
    // Tries to retrieve the coins list from the localStorage every 200ms until done
    const delay = timer(0, this.TIMER_DELAY_MS);
    const fetchCoinsSub = delay.subscribe(() => {
      console.log('check');
      if (this.coinListExists()) {
        this.coins = this.retrieveCoinList();
        fetchCoinsSub.unsubscribe();
        this.devStuff();
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
      this.updateMatchingCoins();
    }
  }

  /**
   * Updates the list of matching coins by using {@link searchedCoin}'s value.
   * @see searchedCoin
   */
  public updateMatchingCoins(): void {
    if (this.coins && this.coins.length > 0){
      this.matchingCoins = this.matchingCoinPipe.transform(this.coins, this.searchedCoin);
    }
  }

  /**
   * Retrieves the coin list from localStorage at 'coinGeckoCoins' key.
   */
  private retrieveCoinList(): CoinDto[] {
    return JSON.parse(localStorage.getItem('coinGeckoCoins'));
  }

  /**
   * Verifies if the coins list is already stored in localStorage and has at least 1 element.
   */
  private coinListExists(): boolean {
    return this.retrieveCoinList().length > 0;
  }
}
