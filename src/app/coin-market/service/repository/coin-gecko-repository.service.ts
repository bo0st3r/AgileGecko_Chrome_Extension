import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CoinDto} from '../../dto/coin-dto';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoinGeckoRepositoryService {
  public COIN_LIST_SUFFIX = 'coins/list';

  constructor(public httpClient: HttpClient) {
  }

  public fetchCoinList(): Observable<HttpResponse<CoinDto[]>> {
    return this.httpClient.get<CoinDto[]>(environment.coingecko_api + this.COIN_LIST_SUFFIX, {observe: 'response'}).pipe(retry(3));
  }
}
