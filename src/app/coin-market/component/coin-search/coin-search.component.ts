import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {TabManagerService} from '../../../chrome/util/tab/tab-manager.service';
import {FavoriteManagerService} from '../../../layout/service/favorite-manager.service';
import {CoinGeckoRepositoryService} from '../../service/repository/coin-gecko-repository.service';
import {coingecko} from '../../../../constants/coingecko';
import {chartex} from '../../../../constants/chartex';
import {MarketDto} from '../../dto/market-dto';
import {CoinSearchManagerService} from '../../service/coin-search-manager.service';
import {CoinListManagerService} from '../../service/coin-list-manager.service';
import {skip, take} from 'rxjs/operators';

@Component({
  selector: 'r-coin-search',
  templateUrl: './coin-search.component.html',
  styleUrls: ['./coin-search.component.css']
})
export class CoinSearchComponent implements OnInit, OnDestroy {
  // Constants
  public readonly coingecko = coingecko;
  public readonly chartex = chartex;
  public readonly tableRowHeight = 41;

  public displayedMarkets: Array<MarketDto> = new Array<MarketDto>();
  public favoritesMarkets: Array<MarketDto> = new Array<MarketDto>();
  public coinsFetchingFailed: boolean;
  /**
   * Subscription of the favorite coins' ids {@link FavoriteManagerService}
   */
  private favoriteIdsSub: Subscription;
  /**
   * Subscription of the coin search {@link CoinSearchManagerService}
   */
  private coinSearchSub: Subscription;

  constructor(
    private coinGeckoRepositoryService: CoinGeckoRepositoryService,
    public tabManagerService: TabManagerService,
    public favoriteManagerService: FavoriteManagerService,
    private coinSearchManagerService: CoinSearchManagerService,
    private coinListManagerService: CoinListManagerService) {
  }


  /**
   * - Subscribe to the search observable and update displayed
   * - Subscribe to favorite coins observable and display it's second emitted value
   */
  ngOnInit(): void {
    this.coinSearchSub = this.coinSearchManagerService.searchAsObservable()
      .subscribe(search => {
          if (!search || !search.length) {
            this.favoriteManagerService.notify();
            return;
          }

          if (!this.coinListManagerService.getCoins()) {
            this.coinListManagerService
              .coinsAsObservable()
              // Skip first because it's a from a BehaviourSubject
              // Then take 1 because we only want to take the first input
              .pipe(skip(1), take(1))
              .subscribe(() => {
                  this.fetchFilteredMarkets(search);
                }
              );
          } else {
            this.fetchFilteredMarkets(search);
          }
        },
        error => {
          console.error(error);
          this.coinsFetchingFailed = true;
        });

    this.favoriteIdsSub = this.favoriteManagerService.favoriteUpdateAsObservable()
      .pipe(skip(1))
      .subscribe(favoriteCoinsIds => {
        this.coinGeckoRepositoryService
          .fetchMarketsByIds(favoriteCoinsIds)
          .subscribe(marketsResp => {
            this.displayedMarkets = marketsResp.body;
          });
      });
    this.favoriteManagerService.notify();
  }

  /**
   * Unsubscribe from {@link favoriteIdsSub}.
   */
  public ngOnDestroy(): void {
    this.favoriteIdsSub.unsubscribe();
    this.coinSearchSub.unsubscribe();
  }

  /**
   * Open a tab for the first coin from {@link displayedMarkets}.
   */
  @HostListener('window:keydown.enter')
  onEnterKeyPressed(): void {
    if (this.displayedMarkets.length) {
      this.tabManagerService.openTab(coingecko.TABS.COIN_PAGE + this.displayedMarkets[0].id);
    }
  }

  /**
   * Filter and fetch the markets from the search.
   * @param search
   * @private
   */
  private fetchFilteredMarkets(search: string): void {
    const filteredCoins = this.coinListManagerService.filter(search);
    this.coinGeckoRepositoryService
      .fetchMarketsByCoins(filteredCoins)
      .subscribe(marketsResp => {
        this.coinsFetchingFailed = false;
        this.displayedMarkets = marketsResp.body;
      }, error => {
        this.coinsFetchingFailed = true;
      });
  }
}
