import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoinDto} from '../../dto/coin-dto';
import {Subscription} from 'rxjs';
import {TabManagerService} from '../../../chrome/util/tab/tab-manager.service';
import {FavoriteManagerService} from '../../../layout/service/favorite-manager.service';
import {LocalStorageManagerService} from '../../../chrome/util/storage/local-storage-manager.service';
import {MatchCoinPipe} from '../../pipe/matching-coin.pipe';
import {CoinGeckoRepositoryService} from '../../service/repository/coin-gecko-repository.service';
import {coingecko} from '../../../../constants/coingecko';
import {chartex} from '../../../../constants/chartex';
import {defaultMarketQueryParams} from '../../type/market-query-params';
import {MarketDto} from '../../dto/market-dto';

@Component({
  selector: 'r-coin-search',
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
  public selectedMarket: MarketDto;
  /**
   * List of coins retrieved from the CoinGecko list endpoint by {@link CoinGeckoRepositoryService}.
   */
  public coins: Array<CoinDto> = new Array<CoinDto>();
  public markets: Array<MarketDto> = new Array<MarketDto>();
  /**
   * List of coins displayed {@link searchedCoin} within {@link coins}.
   */
  public displayedCoins: Array<CoinDto> = new Array<CoinDto>();
  public displayedMarkets: Array<MarketDto> = new Array<MarketDto>();
  /**
   * List of the user's favorite coins.
   */
  public favoriteCoins: Array<CoinDto> = new Array<CoinDto>();
  public favoriteMarkets: Array<MarketDto> = new Array<MarketDto>();
  /**
   * Subscription of the favorite coins Array from {@link FavoriteManagerService}
   */
  public favoriteCoinsSubscription: Subscription;
  /**
   * If the loading fails, this field is set to true.
   */
  public coinsLoadingFailed: boolean;
  // Constants
  public coingecko = coingecko;
  public chartex = chartex;

  constructor(
    public tabManagerService: TabManagerService,
    public favoriteManagerService: FavoriteManagerService,
    public localStorageManagerService: LocalStorageManagerService,
    public coinGeckoRepositoryService: CoinGeckoRepositoryService,
    public matchCoinPipe: MatchCoinPipe) {
  }

  /**
   * TODO
   * Do:
   * -Retrieve the list of coins
   * -Subscribe to {@link FavoriteManagerService} observable for favorite coins updates.
   * -Ask {@link FavoriteManagerService} for a notification and assigns it's value to {@link displayedCoins}.
   * - Fetch the favorite list with {@link FavoriteManagerService} and update {@link favoriteCoins}.
   */
  ngOnInit(): void {
    this.fetchAllMarketsAndUpdate();

    this.fetchAndUpdateCoins();

    this.favoriteCoinsSubscription = this.favoriteManagerService.favoriteUpdateAsObservable().subscribe(favoriteCoins => {
      this.favoriteCoins = favoriteCoins;
    }, error => {
      console.error(error);
    });
    this.favoriteManagerService.notify();
    this.displayedCoins = this.favoriteCoins;
  }

  // TODO
  public fetchAllMarketsAndUpdate(): void {
    let marketsQueryParams = defaultMarketQueryParams;
    console.log('markets', this.markets);
  }

  /**
   * Unsubscribe from {@link favoriteCoinsSubscription}.
   */
  ngOnDestroy(): void {
    this.favoriteCoinsSubscription.unsubscribe();
  }

  /**
   * Fetch the coin list with {@link CoinGeckoRepositoryService} and update {@link coinsLoadingFailed}.
   */
  public fetchAndUpdateCoins(): void {
    this.coinGeckoRepositoryService.fetchCoinList().subscribe(coins => {
      if (coins.body) {
        this.coins = coins.body;
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
    if (this.coins.length > 0 && this.searchedCoin.length > 1) {
      this.displayedCoins = this.matchCoinPipe.transform(this.coins, this.searchedCoin);
    } else if (this.favoriteCoins.length > 0) {
      if (this.searchedCoin.length > 1) {
        this.displayedCoins = this.matchCoinPipe.transform(this.favoriteCoins, this.searchedCoin);
      } else {
        this.displayedCoins = this.favoriteCoins;
      }
    } else {
      this.displayedCoins = new Array<CoinDto>();
    }
  }

  /**
   * Check if the favoriteCoins list contains the given coin.
   * Compare with the 'some' method and by providing coins' IDs.
   * @param coin coin to compare
   */
  public favoriteCoinsContains(coin: CoinDto): boolean {
    return this.favoriteCoins.some(value => value.id === coin.id);
  }
}
