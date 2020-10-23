import {Injectable} from '@angular/core';
import {CoinDto} from '../../coin-market/dto/coin-dto';
import {Observable, Subject} from 'rxjs';
import {LocalStorageManagerService} from '../../chrome/util/storage/local-storage-manager.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that manages user's favorite coins.
 */
export class FavoriteManagerService {
  /**
   * Subject object for the {@link _favoriteCoinsIds} list use.
   */
  public favoriteUpdateSubject = new Subject<string[]>();
  /**
   *  Key for the favorite coins in local storage.
   */
  private LOCAL_STORAGE_KEY = '_favoriteCoinsIds';
  /**
   * Array of favorite coins.
   */
  private _favoriteCoinsIds: string[];
  /**
   * Contains Bitcoin & ETH representations.
   */
  private _defaultFavoritesIds: string[] = ['bitcoin', 'ethereum'];


  /**
   * Initialize {@link _favoriteCoinsIds}'s value from local storage at key {@link LOCAL_STORAGE_KEY}.
   */
  constructor(public localStorageManager: LocalStorageManagerService) {
    this._favoriteCoinsIds = this.localStorageManager.find(this.LOCAL_STORAGE_KEY);
    if (!this._favoriteCoinsIds || this._favoriteCoinsIds.length === 0) {
      this.loadDefaultFavorites();
    }
  }

  /**
   * Updates and save the favorites in local storage.
   * Calls {@link updateFavorite}.
   * @param coin coin's id to update
   */
  public updateAndSaveFavorite(coin: CoinDto): void {
    this.updateFavorite(coin.id);
    this.notify();
    this.localStorageManager.save(this.LOCAL_STORAGE_KEY, this._favoriteCoinsIds);
  }

  /**
   * Add or remove a coin id from {@link _favoriteCoinsIds}, depending on if it's already included in it or not.
   * @param coinId coin's id to update
   */
  public updateFavorite(coinId: string): void {
    const foundCoin = this._favoriteCoinsIds.find(favorite => favorite === coinId);
    const indexOfCoin = this._favoriteCoinsIds.indexOf(foundCoin);
    if (indexOfCoin >= 0) {
      this._favoriteCoinsIds.splice(indexOfCoin, 1);
    } else {
      this._favoriteCoinsIds.push(coinId);
    }
  }

  /**
   * Check if the favorites list contains the given coin.
   * Compare with the 'some' method and by providing coins' IDs.
   * @param coinId coin's id to compare
   */
  public isFavorite(coinId: string): boolean {
    return this._favoriteCoinsIds.some(favorite => favorite === coinId);
  }

  /**
   * Load {@link _favoriteCoinsIds} with {@link _defaultFavoritesIds} if not empty, then notify {@link favoriteUpdateSubject}.
   */
  public loadDefaultFavorites(): void {
    if (this._defaultFavoritesIds) {
      this._favoriteCoinsIds = this._defaultFavoritesIds;
      this.notify();
    } else {
      console.error(`Tried to load empty default favorites.`);
    }
  }

  /**
   * Returns {@link favoriteUpdateSubject} as observable.
   */
  public favoriteUpdateAsObservable(): Observable<Array<string>> {
    return this.favoriteUpdateSubject.asObservable();
  }

  /**
   * Notifies subscribers of a new favorite coins list from {@link _favoriteCoinsIds}.
   */
  public notify(): void {
    this.favoriteUpdateSubject.next(this._favoriteCoinsIds);
  }

  get defaultFavoritesIds(): string[] {
    return this._defaultFavoritesIds;
  }
}
