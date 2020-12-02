import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {CoinDto} from '../dto/coin-dto';
import {CoinGeckoRepositoryService} from './repository/coin-gecko-repository.service';
import {retry} from 'rxjs/operators';
import {CoinSearchManagerService} from './coin-search-manager.service';
import {FilterCoinsPipe} from '../pipe/filter-coins.pipe';

@Injectable({
  providedIn: 'root'
})
/**
 * Manage the updates for the list of coins and automatically load it on first instantiation.
 */
export class CoinListManagerService implements OnDestroy {
  private coinListSubject = new BehaviorSubject<CoinDto[]>(null);

  constructor(private coinGeckoRepositoryService: CoinGeckoRepositoryService,
              private filterCoinPipe: FilterCoinsPipe) {
    this.init();
  }

  ngOnDestroy(): void {
    this.coinListSubject.unsubscribe();
  }

  public coinsAsObservable(): Observable<CoinDto[]> {
    return this.coinListSubject.asObservable();
  }

  public getCoins(): CoinDto[] {
    return this.coinListSubject.getValue();
  }

  /**
   * Filter {@link coins} with {@link FilterCoinsPipe} and put them in {@link filteredCoins}
   * if {@link coins} and {@link searchedCoin} are defined.
   * Otherwise, set it to an empty array.
   */
  public filter(search: string): Array<CoinDto> {
    const coins = this.getCoins();

    if (!coins || !coins.length) {
      throw new Error('Coin list has to be populated to be filtered.');
    }

    if (search.length > 1) {
      return this.filterCoinPipe.transform(coins, search);
    }
    return new Array<CoinDto>();
  }

  private nextCoins(coins: CoinDto[]): void {
    setTimeout(() =>   this.coinListSubject.next(coins), 2000);
    // this.coinListSubject.next(coins);
  }

  private fetch() {
    this.coinGeckoRepositoryService.fetchCoins()
      .pipe(retry(3))
      .subscribe(response => this.nextCoins(response.body));
  }

  private init(): void {
    this.fetch();
  }
}
