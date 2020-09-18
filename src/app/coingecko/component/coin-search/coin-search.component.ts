import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoinDto} from '../../dto/coin-dto';
import {Subscription, timer} from 'rxjs';
import {TabManagerService} from '../../../chrome/util/tab-manager.service';
import {FavoriteManagerService} from '../../../layout/service/favorite-manager.service';
import {LocalStorageManagerService} from '../../../chrome/util/storage/local-storage-manager.service';
import {MatchCoinPipe} from '../../pipe/matching-coin.pipe';
import {LocalStorageKey} from '../../enum/key.enum';
import {Url} from 'src/app/coingecko/enum/url.enum';

@Component({
  selector: 'app-coin-search',
  templateUrl: './coin-search.component.html',
  styleUrls: ['./coin-search.component.css']
})
export class CoinSearchComponent implements OnInit, OnDestroy {
  /**
   * Instance of the {@link Url} enum.
   */
  public Url = Url;
  /**
   * Name or symbol of the searched coin.
   */
  public searchedCoin = '';
  /**
   * Selected coin on the UI.
   */
  public selectedCoin: CoinDto;
  /**
   * List of coins retrieved from the localStorage by using {@link retrieveCoinList}.
   */
  public coins: Array<CoinDto> = new Array<CoinDto>();
  /**
   * List of coins displayed {@link searchedCoin} within {@link coins}.
   */
  public displayedCoins: Array<CoinDto> = new Array<CoinDto>();
  /**
   * List of the user's favorite coins.
   */
  public favoriteCoins: Array<CoinDto> = new Array<CoinDto>();
  /**
   * Subscription of the favorite coins Array from {@link FavoriteManagerService}
   */
  public favoriteCoinsSubscription: Subscription;
  /**
   * Time in ms between 2 calls  of the localStorage for {@link retrieveCoinList}.
   */
  private TIMER_DELAY_MS = 20;
  /**
   * If the loading fails, this field is set to true.
   */
  public coinsLoadingFailed: boolean;
  private nbChecksTreshold = 50;

  constructor(
    public tabManagerService: TabManagerService,
    public favoriteManagerService: FavoriteManagerService,
    public localStorageManagerService: LocalStorageManagerService,
    public matchCoinPipe: MatchCoinPipe) {
  }

  /**
   * Do:
   * -Retrieving the list of coins (tries every {@link TIMER_DELAY_MS} seconds until found).
   * -Subscribes to {@link FavoriteManagerService} observable for favorite coins updates.
   * -Asks {@link FavoriteManagerService} for a notification and assigns it's value to {@link displayedCoins}.
   */
  ngOnInit(): void {
    // Tries to retrieve the coins list from the localStorage every 200ms until done
    const delay = timer(0, this.TIMER_DELAY_MS);
    let nbChecks = 0;
    const fetchCoinsSub = delay.subscribe(() => {
      nbChecks++;
      if (this.coinListExists()) {
        this.coins = this.retrieveCoinList();
        fetchCoinsSub.unsubscribe();
      } else if (nbChecks > this.nbChecksTreshold){
        this.coinsLoadingFailed = true;
        fetchCoinsSub.unsubscribe();
      }
    });

    this.favoriteCoinsSubscription = this.favoriteManagerService.favoriteUpdateAsObservable().subscribe(favoriteCoins => {
      this.favoriteCoins = favoriteCoins;
    });
    this.favoriteManagerService.notify();
    this.displayedCoins = this.favoriteCoins;
  }

  /**
   * Unsubscribe from {@link favoriteCoinsSubscription} and deletes value for {@link LocalStorageKey.COINS_LIST}.
   */
  ngOnDestroy(): void {
    this.favoriteCoinsSubscription.unsubscribe();
    this.localStorageManagerService.delete(LocalStorageKey.COINS_LIST);
  }

  /**
   * Updates the list of displayed coins by using {@link searchedCoin}'s value.
   * If empty, displays the list of favorite coins ({@link favoriteCoins}) instead.
   * If there's no favorite, displays an empty list.
   * @see searchedCoin
   */
  public updateDisplayedCoins(): void {
    if (this.coins.length > 0 && this.searchedCoin.length > 0) {
      this.displayedCoins = this.matchCoinPipe.transform(this.coins, this.searchedCoin);
    } else if (this.favoriteCoins.length > 0) {
      this.displayedCoins = this.matchCoinPipe.transform(this.favoriteCoins, this.searchedCoin);
    } else {
      this.displayedCoins = new Array<CoinDto>();
    }
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

  /**
   * Verifies if the coins list is already stored in localStorage and has at least 1 element.
   */
  private coinListExists(): boolean {
    return this.retrieveCoinList().length > 0;
  }

  /**
   * Retrieves the coin list from localStorage at {@link LocalStorageKey.COINS_LIST} key.
   */
  private retrieveCoinList(): Array<CoinDto> {
    const list: Array<CoinDto> = this.localStorageManagerService.find(LocalStorageKey.COINS_LIST);
    return (list) ? list : new Array<CoinDto>();
  }
}
