import {Injectable, OnInit, Optional} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CoinDto} from '../../dto/coin-dto';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoinGeckoRepositoryService {
  constructor(private httpClient: HttpClient) { }

  public fetchCoins(): Observable<CoinDto[]> {
    return this.httpClient.get<CoinDto[]>(environment.coingecko_api + 'coins/list');
  }
}
