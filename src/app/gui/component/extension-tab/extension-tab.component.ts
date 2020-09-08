import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoinDto} from '../../../coingecko/dto/coin-dto';
import {Subscription, timer} from 'rxjs';
import {TabManagerService} from '../../../chrome/util/tab-manager.service';
import {MatchCoinPipe} from '../../../coingecko/pipe/matching-coin.pipe';
import {FavoriteManagerService} from '../../service/favorite-manager.service';
import {Url} from '../../../coingecko/enum/url.enum';
import {LocalStorageKey} from '../../../coingecko/enum/key.enum';
import {LocalStorageManagerService} from '../../../chrome/util/storage/local-storage-manager.service';

@Component({
  selector: 'app-extension-tab',
  templateUrl: './extension-tab.component.html',
  styleUrls: ['./extension-tab.component.css']
})
export class ExtensionTabComponent implements OnInit, OnDestroy {
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
  public coins: CoinDto[] = [];
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
    const fetchCoinsSub = delay.subscribe(() => {
      if (this.coinListExists()) {
        this.coins = this.retrieveCoinList();
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
   * @see searchedCoin
   */
  public updateDisplayedCoins(): void {
    if (this.coins.length > 0 && this.searchedCoin.length > 0) {
      this.displayedCoins = this.matchCoinPipe.transform(this.coins, this.searchedCoin);
    } else if (this.favoriteCoins.length > 0) {
      this.displayedCoins = this.favoriteCoins;
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
  private retrieveCoinList(): CoinDto[] {
    return this.localStorageManagerService.find(LocalStorageKey.COINS_LIST);
  }
}
