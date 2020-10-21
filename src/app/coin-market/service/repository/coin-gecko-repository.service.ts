import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CoinDto} from '../../dto/coin-dto';
import {EMPTY, Observable, of, Subject} from 'rxjs';
import {concatMap, expand, map, retry} from 'rxjs/operators';
import {coingecko} from '../../../../constants/coingecko';
import {constants} from '../../../../constants/constants';
import {MarketDto} from '../../dto/market-dto';
import {defaultMarketQueryParams, MarketQueryParams} from '../../type/market-query-params';
import {HttpOptionsGeneratorService} from '../../../http/util/http-options-generator.service';
import {CaseStyle} from '../../../typo-case/enum/case-style';
import {CaseTransformerService} from '../../../typo-case/service/case-transformer.service';
import {logger} from 'codelyzer/util/logger';

@Injectable({
  providedIn: 'root'
})
export class CoinGeckoRepositoryService {

  constructor(public httpClient: HttpClient,
              public httpOptionsGenerator: HttpOptionsGeneratorService,
              public caseTransformer: CaseTransformerService) {
  }

  public fetchCoinList(): Observable<HttpResponse<CoinDto[]>> {
    let request = this.httpClient.get<CoinDto[]>(coingecko.ENDPOINTS.COINS_LIST,
      {observe: 'response'});
    request = request.pipe(retry(constants.HTTP.NB_TRIALS));
    return request;
  }

  public fetchMarkets(params: MarketQueryParams): Observable<HttpResponse<MarketDto[]>> {
    let httpParams = this.httpOptionsGenerator.httpParamsFromObject(params, CaseStyle.SNAKE);
    let request = this.httpClient.get<MarketDto[]>(coingecko.ENDPOINTS.COINS_MARKETS,
      {observe: 'response', params: httpParams}).pipe(map(resp => {
      let respCopy = Object.create(resp);
      respCopy.body = this.caseTransformer.snakeArrayOfPairsToCamel(resp.body);
      return respCopy;

    }));

    request = request.pipe(retry(constants.HTTP.NB_TRIALS));
    return request;
  }

  // TODO
  public fetchAllMarkets(): Observable<HttpResponse<MarketDto[]>> {
    let params = defaultMarketQueryParams;
    params.perPage = 250;
    params.page = 1;

    let subscription = this.fetchMarkets(params).pipe(expand(value => {
      if(value.body){
        params.page++;
        return this.fetchMarkets(params);
      } else {
        return EMPTY;
      }
    }));

    return subscription;
  }
}
