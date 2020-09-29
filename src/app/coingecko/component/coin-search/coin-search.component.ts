import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoinDto} from '../../dto/coin-dto';
import {Subscription} from 'rxjs';
import {TabManagerService} from '../../../chrome/util/tab-manager.service';
import {FavoriteManagerService} from '../../../layout/service/favorite-manager.service';
import {LocalStorageManagerService} from '../../../chrome/util/storage/local-storage-manager.service';
import {MatchCoinPipe} from '../../pipe/matching-coin.pipe';
import {LocalStorageKey} from '../../enum/key.enum';
import {Url} from 'src/app/coingecko/enum/url.enum';
import {CoinGeckoRepositoryService} from '../../service/repository/coin-gecko-repository.service';

@Component({
  selector: 'app-coin-search',
  templateUrl: './coin-search.component.html',
  styleUrls: ['./coin-search.component.css']
})
export class CoinSearchComponent implements OnInit, OnDestroy {
  /**
   * Name or symbol of the searched coin.
   */
  public searchedCoin = '';
  /**
   * Selected coin on the UI.
   */
  public selectedCoin: CoinDto;
  /**
   * List of coins retrieved from the CoinGecko list endpoint by {@link CoinGeckoRepositoryService}.
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
   * If the loading fails, this field is set to true.
   */
  public coinsLoadingFailed: boolean;
  /**
   * Instance of the {@link Url} enum.
   */
  public Url = Url;

  constructor(
    public tabManagerService: TabManagerService,
    public favoriteManagerService: FavoriteManagerService,
    public localStorageManagerService: LocalStorageManagerService,
    public coinGeckoRepositoryService: CoinGeckoRepositoryService,
    public matchCoinPipe: MatchCoinPipe) {
  }

  /**
   * Do:
   * -Retrieve the list of coins
   * -Subscribe to {@link FavoriteManagerService} observable for favorite coins updates.
   * -Ask {@link FavoriteManagerService} for a notification and assigns it's value to {@link displayedCoins}.
   * - Fetch the favorite list with {@link FavoriteManagerService} and update {@link favoriteCoins}.

   */
  ngOnInit(): void {
    this.fetchAndUpdateCoins();

    this.favoriteCoinsSubscription = this.favoriteManagerService.favoriteUpdateAsObservable().subscribe(favoriteCoins => {
      this.favoriteCoins = favoriteCoins;
    }, error => {
      console.error(error);
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
   * Fetch the coin list with {@link CoinGeckoRepositoryService} and update {@link coinsLoadingFailed}.
   */
  public fetchAndUpdateCoins(): void {
    this.coinGeckoRepositoryService.fetchCoinList().subscribe(coinsResponse => {
      if (coinsResponse.body) {
        this.coins = coinsResponse.body;
        this.coinsLoadingFailed = false;
      } else {
        this.coinsLoadingFailed = true;
      }
    }, error => {
      this.coinsLoadingFailed = true;
      throw error;
    });
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
}
