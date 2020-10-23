import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CoinDto} from '../../dto/coin-dto';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {TabManagerService} from '../../../chrome/util/tab/tab-manager.service';
import {FavoriteManagerService} from '../../../layout/service/favorite-manager.service';
import {LocalStorageManagerService} from '../../../chrome/util/storage/local-storage-manager.service';
import {MatchCoinPipe} from '../../pipe/matching-coin.pipe';
import {CoinGeckoRepositoryService} from '../../service/repository/coin-gecko-repository.service';
import {coingecko} from '../../../../constants/coingecko';
import {chartex} from '../../../../constants/chartex';
import {MarketDto} from '../../dto/market-dto';
import {debounceTime} from 'rxjs/operators';
import {constants} from '../../../../constants/constants';
import {error} from '@angular/compiler/src/util';

@Component({
  selector: 'r-coin-search',
  templateUrl: './coin-search.component.html',
  styleUrls: ['./coin-search.component.css']
})
export class CoinSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  // Constants
  public readonly coingecko = coingecko;
  public readonly chartex = chartex;

  /**
   * Name or symbol of the searched coin.
   */
  public searchedCoin = '';

  /**
   * List of coins retrieved from the CoinGecko list endpoint by {@link CoinGeckoRepositoryService}.
   */
  public coins: Array<CoinDto> = new Array<CoinDto>();

  /**
   * List of coins displayed {@link searchedCoin} within {@link coins}.
   */
  public displayedCoins: Array<CoinDto> = new Array<CoinDto>();

  // public filteredCoins: Array<CoinDto> = new Array<CoinDto>();

  public filteredMarkets: Array<MarketDto> = new Array<MarketDto>();

  /**
   * List of the user's favorite coins.
   */
  public favorites: Array<CoinDto> = new Array<MarketDto>();

  /**
   * Subscription of the favorite coins Array from {@link FavoriteManagerService}
   */
  public favoriteCoinsSubscription: Subscription;

  /**
   * If the loading fails, this field is set to true.
   */
  public coinsLoadingFailed: boolean;

  public inputObs: Observable<Event>;
  @ViewChild('searchInput')
  public searchInput: ElementRef;

  constructor(
    private localStorageManagerService: LocalStorageManagerService,
    private coinGeckoRepositoryService: CoinGeckoRepositoryService,
    public tabManagerService: TabManagerService,
    public favoriteManagerService: FavoriteManagerService,
    public matchCoinPipe: MatchCoinPipe) {
  }

  /**
   * TODO
   * Do:
   * -Retrieve the list of coins
   * -Subscribe to {@link FavoriteManagerService} observable for favorite coins updates.
   * -Ask {@link FavoriteManagerService} for a notification and assigns it's value to {@link displayedCoins}.
   * - Fetch the favorite list with {@link FavoriteManagerService} and update {@link favorites}.
   */
  ngOnInit(): void {
    this.fetchAndUpdateCoins();

    this.favoriteCoinsSubscription = this.favoriteManagerService.favoriteUpdateAsObservable()
      .subscribe(favoriteCoinsIds => {
        this.coinGeckoRepositoryService.fetchMarketsByIds(favoriteCoinsIds).subscribe(marketsResp => {
          this.favorites = marketsResp.body;
          this.updateDisplayedMarkets();
        });
      });

    this.favoriteManagerService.notify();
  }

  /**
   * Set a debounce time between typing characters for filtering and fetching coins.
   */
  ngAfterViewInit(): void {
    this.inputObs = fromEvent(this.searchInput.nativeElement, 'keydown');
    this.inputObs.pipe(debounceTime(constants.MS_BETWEEN)).subscribe(() => {
      this.filterCoins();
      this.fetchFilteredMarkets();
    });
  }

  /**
   * Unsubscribe from {@link favoriteCoinsSubscription}.
   */
  public ngOnDestroy(): void {
    this.favoriteCoinsSubscription.unsubscribe();
  }

  /**
   * If {@link displayedCoins} has values, open a tab for the first coin of the list.
   */
  @HostListener('window:keydown.enter')
  onEnterKeyPressed(): void {
    if (this.displayedCoins.length) {
      this.tabManagerService.openTab(coingecko.TABS.COIN_PAGE + this.displayedCoins[0].id);
    }
  }

  /**
   * Fetch markets corresponding to the values of {@link filteredCoins} and updates
   * the interface if {@param updateInterface}.
   * @param updateInterface if should update the UI, default to true
   */
  public fetchFilteredMarkets(updateInterface: boolean = true): void {
    // try {
    //   console.log('a');
    //   this.coins = [];
      const ids = this.filterCoins().map(coin => {
        return coin.id;
      });
      // console.log('try');
      this.coinGeckoRepositoryService.fetchMarketsByIds(ids).subscribe(marketsResp => {
        this.filteredMarkets = marketsResp.body;
        if (updateInterface) {
          this.updateDisplayedMarkets();
        }
      });
    // } catch {
    //   console.log('catch');
    //
    // }
    // console.log('b');

  }

  /**
   * Call {@link filteredCoins} and {@link fetchFilteredMarkets}.
   */
  public updateCoinsTable(): void {
    this.filterCoins();
    this.fetchFilteredMarkets();
  }

  /**
   * Update {@link displayedCoins}'s value with either {@link filteredMarkets}, {@link favorites} or an empty array.
   */
  private updateDisplayedMarkets(): void {
    if (this.filteredMarkets.length && this.searchedCoin.length > 0) {
      this.displayedCoins = this.filteredMarkets;
    } else if (this.favorites.length > 0) {
      this.displayedCoins = this.favorites;
    } else {
      this.displayedCoins = new Array<MarketDto>();
    }
  }

  /**
   * Fetch the coin list with {@link CoinGeckoRepositoryService} and update {@link coinsLoadingFailed}.
   */
  private fetchAndUpdateCoins(): void {
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
   * Filter {@link coins} with {@link MatchCoinPipe} and put them in {@link filteredCoins}
   * if {@link coins} and {@link searchedCoin} are defined.
   * Otherwise, set it to an empty array.
   */
  private filterCoins(): Array<CoinDto> {
    if (this.coins.length && this.searchedCoin.length > 1) {
      return this.matchCoinPipe.transform(this.coins, this.searchedCoin);
    }
    throw error('Both coin list and searched coin should be populated.');
  }
}
