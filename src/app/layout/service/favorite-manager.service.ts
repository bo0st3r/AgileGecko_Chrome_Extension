import {Injectable} from '@angular/core';
import {CoinDto} from '../../coingecko/dto/coin-dto';
import {Observable, Subject} from 'rxjs';
import {LocalStorageManagerService} from '../../chrome/util/storage/local-storage-manager.service';
import {errorObject} from 'rxjs/internal-compatibility';
import {error} from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that manages user's favorite coins.
 */
export class FavoriteManagerService {
  /**
   * Subject object for the {@link _favoriteCoins} list use.
   */
  public favoriteUpdateSubject = new Subject<CoinDto[]>();
  /**
   *  Key for the favorite coins in local storage.
   */
  private LOCAL_STORAGE_KEY = '_favoriteCoins';
  /**
   * Array of favorite coins.
   */
  private _favoriteCoins: CoinDto[];
  /**
   * Contains Bitcoin & ETH representations.
   */
  private _defaultFavorites: CoinDto[] = [
    {id: 'bitcoin', symbol: 'btc', name: 'Bitcoin'}, {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum'
    }];


  /**
   * Initialize {@link _favoriteCoins}'s value from local storage at key {@link LOCAL_STORAGE_KEY}.
   */
  constructor(public localStorageManager: LocalStorageManagerService) {
    this._favoriteCoins = this.localStorageManager.find(this.LOCAL_STORAGE_KEY);
    if(!this._favoriteCoins || this._favoriteCoins.length === 0){
      this.loadDefaultFavorites();
    }
  }

  /**
   * Updates and save the favorites in local storage.
   * Calls {@link updateFavorite}.
   * @param coin coin to update
   */
  public updateAndSaveFavorite(coin: CoinDto): void {
    this.updateFavorite(coin);
    this.notify();
    this.localStorageManager.save(this.LOCAL_STORAGE_KEY, this._favoriteCoins);
  }

  /**
   * Add or remove a coin from {@link _favoriteCoins}, depending on if it's already included in it or not.
   * @param coin coin to update
   */
  public updateFavorite(coin: CoinDto): void {
    const foundCoin = this._favoriteCoins.find(value => value.id === coin.id);
    const indexOfCoin = this._favoriteCoins.indexOf(foundCoin);
    if (indexOfCoin >= 0) {
      const a = this._favoriteCoins.splice(indexOfCoin, 1);
    } else {
      this._favoriteCoins.push(coin);
    }
  }

  /**
   * Load {@link _favoriteCoins} with {@link _defaultFavorites} if not empty, then notify {@link favoriteUpdateSubject}.
   */
  public loadDefaultFavorites(): void {
    if (this._defaultFavorites) {
      this._favoriteCoins = this._defaultFavorites;
      this.notify();
    } else {
      console.error(`Tried to load empty default favorites.`)
    }
  }

  /**
   * Returns {@link favoriteUpdateSubject} as observable.
   */
  public favoriteUpdateAsObservable(): Observable<Array<CoinDto>> {
    return this.favoriteUpdateSubject.asObservable();
  }

  /**
   * Notifies subscribers of a new favorite coins list from {@link _favoriteCoins}.
   */
  public notify(): void {
    this.favoriteUpdateSubject.next(this._favoriteCoins);
  }
}
