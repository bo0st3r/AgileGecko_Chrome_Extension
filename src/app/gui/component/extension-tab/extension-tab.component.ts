import {Component, OnInit} from '@angular/core';
import {CoinDto} from '../../../coingecko/dto/coin-dto';
import {timer} from 'rxjs';

@Component({
  selector: 'app-extension-tab',
  templateUrl: './extension-tab.component.html',
  styleUrls: ['./extension-tab.component.css']
})
export class ExtensionTabComponent implements OnInit {
  public COIN_PREFIX = 'https://www.coingecko.com/en/coins/';
  public coins: CoinDto[];
  public searchedCoin = '';

  public matchingCoins: CoinDto[];

  constructor() {
  }

  ngOnInit(): void {
    // Tries to retrieve the coins list from the localStorage every 200ms until done
    const delay = timer(0, 200);
    const fetchCoinsSub = delay.subscribe(() => {
      if (this.isCoinsListFilled()) {
        this.coins = this.fetchCoinsList();
        fetchCoinsSub.unsubscribe();
      }
    });
  }

  public findMatchingCoins(): void {
    console.log(this.searchedCoin.length);
    if (this.searchedCoin.length >= 3) {
      this.matchingCoins = this.coins.filter(coin => {
        const nameLowered = coin.name.toLowerCase();
        return nameLowered.includes(this.searchedCoin);
      });

      console.log(this.matchingCoins);
    }
  }

  public openCoinTab(coinId: string): void {
    chrome.tabs.create({url: this.COIN_PREFIX + coinId}, () => {
    });
  }

  private isCoinsListFilled(): boolean {
    return this.fetchCoinsList() != null;
  }

  private fetchCoinsList(): CoinDto[] {
    return JSON.parse(localStorage.getItem('coinGeckoCoins'));
  }
}
