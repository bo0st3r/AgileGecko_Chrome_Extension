import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CoinDto} from '../../dto/coin-dto';
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';
import {coingecko} from '../../../../constants/coingecko';

@Injectable({
  providedIn: 'root'
})
export class CoinGeckoRepositoryService {
  public COIN_LIST_SUFFIX = 'coins/list';

  constructor(public httpClient: HttpClient) {
  }

  public fetchCoins(): Observable<HttpResponse<CoinDto[]>> {
    return this.httpClient.get<CoinDto[]>(coingecko.API.HOST + this.COIN_LIST_SUFFIX, {observe: 'response'}).pipe(retry(3));
  }
}
