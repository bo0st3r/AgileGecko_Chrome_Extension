import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CoinDto} from '../../dto/coin-dto';
import {EMPTY, Observable} from 'rxjs';
import {expand, map, retry} from 'rxjs/operators';
import {coingecko} from '../../../../constants/coingecko';
import {constants} from '../../../../constants/constants';
import {MarketDto} from '../../dto/market-dto';
import {defaultMarketQueryParams, MarketQueryParam} from '../../type/market-query-param';
import {HttpOptionsGeneratorService} from '../../../http/util/http-options-generator.service';
import {CaseStyle} from '../../../typo-case/enum/case-style';
import {CaseTransformerService} from '../../../typo-case/service/case-transformer.service';

@Injectable({
  providedIn: 'root'
})
export class CoinGeckoRepositoryService {

  constructor(public httpClient: HttpClient,
              public httpOptionsGenerator: HttpOptionsGeneratorService,
              public caseTransformer: CaseTransformerService) {
  }

  /**
   * Fetch the list of all coins.
   */
  public fetchCoinList(): Observable<HttpResponse<CoinDto[]>> {
    let request = this.httpClient.get<CoinDto[]>(coingecko.ENDPOINTS.COINS_LIST,
      {observe: 'response'});
    request = request.pipe(retry(constants.HTTP.NB_TRIALS));
    return request;
  }

  /**
   * Fetch markets for the given ids, can also give params.
   * @param marketsIds array of ids
   */
  public fetchMarketsByIds(marketsIds: string[], params:MarketQueryParam = defaultMarketQueryParams): Observable<HttpResponse<MarketDto[]>>{
    params.ids = marketsIds;
    return this.fetchMarkets(params);
  }

  /**
   * Fetch markets for given params.
   * @param params
   */
  public fetchMarkets(params: MarketQueryParam = defaultMarketQueryParams): Observable<HttpResponse<MarketDto[]>> {
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

  /**
   * Fetch all markets by iterating over pages of 250 entries.
   */
  public fetchAllMarkets(): Observable<HttpResponse<MarketDto[]>> {
    let params = defaultMarketQueryParams;
    params.perPage = 250;
    params.page = 1;

    let subscription = this.fetchMarkets(params).pipe(expand(value => {
      if (value.body) {
        params.page++;
        return this.fetchMarkets(params);
      } else {
        return EMPTY;
      }
    }));

    return subscription;
  }
}
