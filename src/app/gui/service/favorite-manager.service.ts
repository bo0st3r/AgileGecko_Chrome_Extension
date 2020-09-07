import {Injectable, OnInit} from '@angular/core';
import {CoinDto} from '../../coingecko/dto/coin-dto';
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
   * Subject object for the {@link favoriteCoins} list use.
   */
  public favoriteUpdateSubject = new Subject<Array<CoinDto>>();
  /**
   *  Key for the favorite coins in local storage.
   */
  private LOCAL_STORAGE_KEY = 'favoriteCoins';
  /**
   * Array of favorite coins.
   */
  private favoriteCoins: Array<CoinDto> = new Array<CoinDto>();

  /**
   * Initialize {@link favoriteCoins}'s value from local storage at key {@link LOCAL_STORAGE_KEY}.
   */
  constructor(public localStorageManager: LocalStorageManagerService) {
    this.favoriteCoins = this.localStorageManager.find(this.LOCAL_STORAGE_KEY);
  }

  /**
   * Updates and save the favorites in local storage.
   * Calls {@link updateFavoriteThenNotify}.
   * @param coin coin to update
   */
  public updateAndSaveFavorite(coin: CoinDto): void {
    this.updateFavoriteThenNotify(coin);
    this.localStorageManager.save(this.LOCAL_STORAGE_KEY, this.favoriteCoins);
  }

  /**
   * Add or remove a coin from {@link favoriteCoins}, depending on if it's already included in it or not.
   * Then notifies {@link favoriteUpdateSubject} with {@link favoriteCoins}'s value.
   * @param coin coin to update
   */
  public updateFavoriteThenNotify(coin: CoinDto): void {
    const foundCoin = this.favoriteCoins.find(value => value.id === coin.id);
    const indexOfCoin = this.favoriteCoins.indexOf(foundCoin);
    if (indexOfCoin >= 0) {
      const a = this.favoriteCoins.splice(indexOfCoin, 1);
    } else {
      this.favoriteCoins.push(coin);
    }
    this.favoriteUpdateSubject.next(this.favoriteCoins);
  }

  /**
   * Returns {@link favoriteUpdateSubject} as observable.
   */
  public favoriteUpdateAsObservable(): Observable<Array<CoinDto>> {
    return this.favoriteUpdateSubject.asObservable();
  }

  /**
   * Notifies subscribers of a new favorite coins list from {@link favoriteCoins}.
   */
  public notify(): void {
    this.favoriteUpdateSubject.next(this.favoriteCoins);
  }
}
