import { Component, OnInit } from '@angular/core';
import {CoinDto} from '../../../coingecko/dto/coin-dto';
import {CoinGeckoRepositoryService} from '../../../coingecko/service/repository/coin-gecko-repository.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-extension-tab',
  templateUrl: './extension-tab.component.html',
  styleUrls: ['./extension-tab.component.css']
})
export class ExtensionTabComponent implements OnInit {
   public coins: CoinDto[];
   public test = 'none';
   public nb;
   public err;

  constructor(private coinGeckoRepository: CoinGeckoRepositoryService) { }

  ngOnInit(): void {
    this.nb = (Math.random() * 10000);
    this.fetchCoins();
  }

  private fetchCoins(): void {
    this.coinGeckoRepository.fetchCoins().subscribe(res =>{
        this.coins = res;
        this.test = 'c';
      },
        error =>
          this.test = error);
  }
}
