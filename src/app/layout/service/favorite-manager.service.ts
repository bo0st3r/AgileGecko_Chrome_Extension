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
   * Subject object for the {@link _coinsIds} list use.
   */
  public updateSubject = new Subject<string[]>();
  /**
   *  Key for the favorite coins in local storage.
   */
  private LOCAL_STORAGE_KEY = '_favoriteCoinsIds';
  /**
   * Array of favorite coins.
   */
  private _coinsIds: string[];

  /**
   * Initialize {@link _coinsIds}'s value from local storage at key {@link LOCAL_STORAGE_KEY}.
   */
  constructor(public localStorageManager: LocalStorageManagerService) {
    this._coinsIds = this.localStorageManager.find(this.LOCAL_STORAGE_KEY);
    if (!this._coinsIds || this._coinsIds.length === 0) {
      this.loadDefault();
    }
  }

  /**
   * Contains Bitcoin & ETH representations.
   */
  private _defaultIds: string[] = ['bitcoin', 'ethereum'];

  get defaultIds(): string[] {
    return this._defaultIds;
  }

  /**
   * Updates and save the favoritesMarkets in local storage.
   * Calls {@link update}.
   * @param coin coin's id to update
   */
  public updateAndSave(coin: CoinDto): void {
    this.update(coin.id);
    console.log('after update', this._coinsIds);
    this.notify();
    this.localStorageManager.save(this.LOCAL_STORAGE_KEY, this._coinsIds);
  }

  /**
   * Add or remove a coin id from {@link _coinsIds}, depending on if it's already included in it or not.
   * @param coinId coin's id to update
   */
  public update(coinId: string): void {
    const contains = this.contain(coinId);
    if (contains) {
      this.remove(coinId);
    } else {
      this.add(coinId);
    }
  }

  /**
   * Check if the favoritesMarkets list contains the given coin.
   * Compare with the 'some' method and by providing coins' IDs.
   * @param coinId coin's id to compare
   */
  public contain(coinId: string): boolean {
    return this._coinsIds.includes(coinId);
  }

  public get(coinId: string) {
    return this._coinsIds.find(favorite => favorite === coinId);
  }

  /**
   * Load {@link _coinsIds} with {@link _defaultIds} if not empty, then notify {@link updateSubject}.
   */
  public loadDefault(): void {
    if (this._defaultIds) {
      this._coinsIds = this._defaultIds;
      this.notify();
    } else {
      console.error(`Tried to load empty default favorites.`);
    }
  }

  /**
   * Returns {@link updateSubject} as observable.
   */
  public favoriteUpdateAsObservable(): Observable<Array<string>> {
    return this.updateSubject.asObservable();
  }

  /**
   * Notifies subscribers of a new favorite coins list from {@link _coinsIds}.
   */
  public notify(): void {
    this.updateSubject.next(this._coinsIds);
  }

  private add(coinId: string): boolean {
    const lengthBefore = this._coinsIds.length;
    this._coinsIds.push(coinId);
    return this._coinsIds.length !== lengthBefore;
  }

  private remove(coinId: string): boolean {
    const indexOfCoin = this._coinsIds.indexOf(coinId);
    if (indexOfCoin) {
      this._coinsIds.splice(indexOfCoin, 1);
    }
    return indexOfCoin ? true : false;
  }
}
