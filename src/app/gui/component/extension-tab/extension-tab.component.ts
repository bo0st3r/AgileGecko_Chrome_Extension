import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoinDto} from '../../../coingecko/dto/coin-dto';
import {Subscription, timer} from 'rxjs';
import {TabManagerService} from '../../../chrome/util/tab-manager.service';
import {MatchCoinPipe} from '../../../coingecko/pipe/matching-coin.pipe';
import {environment} from '../../../../environments/environment';
import {FavoriteManagerService} from '../../service/favorite-manager.service';

@Component({
  selector: 'app-extension-tab',
  templateUrl: './extension-tab.component.html',
  styleUrls: ['./extension-tab.component.css']
})
export class ExtensionTabComponent implements OnInit, OnDestroy {
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
  public coins: CoinDto[] = [];
  /**
   * Name or symbol of the searched coin.
   */
  public searchedCoin = '';
  /**
   * List of coins matching {@link searchedCoin} within {@link coins}.
   */
  public matchingCoins: Array<CoinDto> = new Array<CoinDto>();
  /**
   * List of the user's favorite coins.
   */
  public favoriteCoins: Array<CoinDto> = new Array<CoinDto>();
  /**
   * Subscription of the favorite coins Array from {@link FavoriteManagerService}
   */
  public favoriteCoinsSubscription: Subscription;
  /**
   * Selected coin on the UI.
   */
  public selectedCoin: CoinDto;
  /**
   * Time in ms between 2 calls  of the localStorage for {@link retrieveCoinList}.
   */
  private TIMER_DELAY_MS = 20;

  constructor(
    public tabManagerService: TabManagerService,
    public favoriteManagerService: FavoriteManagerService,
    public matchCoinPipe: MatchCoinPipe
  ) {
  }

  // TODO
  ngOnInit(): void {
    // Tries to retrieve the coins list from the localStorage every 200ms until done
    const delay = timer(0, this.TIMER_DELAY_MS);
    const fetchCoinsSub = delay.subscribe(() => {
      if (this.coinListExists()) {
        this.coins = this.retrieveCoinList();
        // this.devStuff();
        fetchCoinsSub.unsubscribe();
      }
    });

    this.favoriteCoinsSubscription = this.favoriteManagerService.favoriteUpdateAsObservable().subscribe(favoriteCoins => {
      this.favoriteCoins = favoriteCoins;
    });
    this.favoriteManagerService.notify();
    this.matchingCoins = this.favoriteCoins;
  }

  // TODO
  ngOnDestroy(): void {
    this.favoriteCoinsSubscription.unsubscribe();
  }

  /**
   * Updates the list of matching coins by using {@link searchedCoin}'s value.
   * If empty, displays the list of favorite coins ({@link favoriteCoins}) instead.
   * @see searchedCoin
   */
  public updateMatchingCoins(): void {
    if (this.coins.length > 0 && this.searchedCoin.length > 0) {
      this.matchingCoins = this.matchCoinPipe.transform(this.coins, this.searchedCoin);
    } else if (this.favoriteCoins.length > 0) {
      this.matchingCoins = this.favoriteCoins;
    }
  }

  /**
   * If dev. env.:
   * Set 'searchedCoin' value as 'btc'.
   */
  private devStuff(): void {
    if (!environment.production) {
      // const btc = this.matchCoinPipe.transform(this.coins, 'btc').shift();
      // const eth = this.matchCoinPipe.transform(this.coins, 'eth').shift();
      // this.matchingCoins.push(btc, eth);
      this.searchedCoin = 'btc';
      this.updateMatchingCoins();
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

  /**
   * Check if the favoriteCoins list contains the given coin.
   * It does so by using the 'some' method and comparing coin's IDs instead of using the 'includes' method,
   * because it is comparing a {@link CoinDTO} object to a list of JSON objects.
   * @param coin the coin to compare
   */
  public favoriteCoinsContains(coin: CoinDto): boolean {
    return this.favoriteCoins.some(value => value.id === coin.id);
  }
}
