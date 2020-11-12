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
  public displayedCoins: Array<MarketDto> = new Array<MarketDto>();

  public filteredMarkets: Array<MarketDto> = new Array<MarketDto>();

  /**
   * List of the user's favorite coins.
   */
  public favorites: Array<MarketDto> = new Array<MarketDto>();

  /**
   * Subscription of the favorite coins Array from {@link FavoriteManagerService}
   */
  public favoriteCoinsSubscription: Subscription;

  public coinsLoadingFailed: boolean;
  public canSearch = true;

  /**
   * Search input element.
   */
  @ViewChild('searchInput')
  public readonly searchInput: ElementRef;
  /**
   * Observable for the search input element: {@link searchInput}.
   */
  public inputObs: Observable<Event>;

  public readonly rowHeight = 41;

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
    const fetchSuccess = this.fetchAndUpdateCoins();
    [this.canSearch, this.coinsLoadingFailed] = [fetchSuccess, !fetchSuccess];

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
   * Set a debounce time between typing two characters for filtering and fetching coins.
   */
  ngAfterViewInit(): void {
    this.inputObs = fromEvent(this.searchInput.nativeElement, 'keydown');
    this.inputObs.pipe(debounceTime(constants.MS_BETWEEN)).subscribe(() => {
      this.searchedCoin = this.searchedCoin.trim();
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
  public fetchFilteredMarkets(): void {
    const ids = this.filterCoins().map(coin => {
      return coin.id;
    });

    if (ids.length) {
      this.coinGeckoRepositoryService.fetchMarketsByIds(ids).subscribe(marketsResp => {
        this.filteredMarkets = marketsResp.body;
        this.updateDisplayedMarkets();
      });
    } else {
      this.filteredMarkets = new Array<MarketDto>();
      this.updateDisplayedMarkets();
    }
  }

  /**
   * Update {@link displayedCoins}'s value with either {@link filteredMarkets}, {@link favorites} or an empty array.
   * @param updateInterface does nothing if false. True by default.
   */
  private updateDisplayedMarkets(updateInterface: boolean = true): void {
    if (updateInterface) {
      if (this.searchedCoin.length > 1) {
        // Looking after a coin...
        if (this.filteredMarkets.length) {
          // and has matches
          this.displayedCoins = this.filteredMarkets;
        } else if (this.favorites.length) {
          // and didn't match any
          this.displayedCoins = new Array<MarketDto>();
        }
      } else {
        // Not looking after a coin
        this.displayedCoins = this.favorites;
      }
    }
  }

  /**
   * Fetch the coin list with {@link CoinGeckoRepositoryService} and update {@link coinsLoadingFailed}.
   */
  private fetchAndUpdateCoins(): boolean {
    this.coinGeckoRepositoryService.fetchCoinList().subscribe(coins => {
      this.coins = coins.body;
    }, error => {
      throw error;
    });
    return true;
  }

  /**
   * Filter {@link coins} with {@link MatchCoinPipe} and put them in {@link filteredCoins}
   * if {@link coins} and {@link searchedCoin} are defined.
   * Otherwise, set it to an empty array.
   */
  private filterCoins(): Array<CoinDto> {
    if (!this.coins.length) {
      console.error('Coin list should be populated.', this.coins);
    }

    if (this.searchedCoin.length > 1) {
      return this.matchCoinPipe.transform(this.coins, this.searchedCoin);
    }
    return new Array<CoinDto>();
  }
}
