import {Injectable, OnInit} from '@angular/core';
import {CoinDto} from '../../coingecko/dto/coin-dto';
import {Observable, Subject} from 'rxjs';
import local = chrome.storage.local;

@Injectable({
  providedIn: 'root'
})
// TODO
export class FavoriteManagerService {
  public favoriteUpdateSubject = new Subject<Array<CoinDto>>();
  private LOCAL_STORAGE_KEY = 'favoriteCoins';
  private favoriteCoins: Array<CoinDto> = new Array<CoinDto>();

  constructor() {
    this.loadFromLocalStorage();
  }

  public favoriteUpdateAsObservable(): Observable<Array<CoinDto>> {
    return this.favoriteUpdateSubject.asObservable();
  }

  public notify(): void{
    this.favoriteUpdateSubject.next(this.favoriteCoins);
  }

  public updateAndSaveFavorite(coin: CoinDto): void {
    this.updateFavorite(coin);
    this.saveInLocalStorage();
  }

  public updateFavorite(coin: CoinDto): void {
    const foundCoin = this.favoriteCoins.find(value => value.id === coin.id)
    const indexOfCoin = this.favoriteCoins.indexOf(foundCoin);
    if (indexOfCoin >= 0) {
      const a = this.favoriteCoins.splice(indexOfCoin, 1);
    } else {
      this.favoriteCoins.push(coin);
    }
    this.favoriteUpdateSubject.next(this.favoriteCoins);
  }

  public saveInLocalStorage(): void {
    const json = JSON.stringify(this.favoriteCoins);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, json);
  }

  public loadFromLocalStorage(): boolean {
    const json = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    console.log(JSON.parse(json));
    const coinsLoaded: Array<CoinDto> = JSON.parse(json);
    console.log(coinsLoaded)

    if (coinsLoaded) {
      this.favoriteCoins = coinsLoaded;
      return true;
    }
    return false;
  }
}
