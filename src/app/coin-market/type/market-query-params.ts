import {VsCurrencyEnum} from '../enum/vs-currency.enum';
import {MarketOrderEnum} from '../enum/market-order.enum';
import {MarketCategoryEnum} from '../enum/market-category.enum';
import {PriceEvolutionTimeframeEnum} from '../enum/price-evolution-timeframe.enum';

export interface MarketQueryParams {
  vsCurrency: VsCurrencyEnum,
  marketOrder?: MarketOrderEnum,
  category?: MarketCategoryEnum,
  priceChangePercentage?: PriceEvolutionTimeframeEnum[]
  ids?: string[],
  perPage?: number,
  page?: number,
  sparkline?: boolean,
}

export const defaultMarketQueryParams: MarketQueryParams = {
  vsCurrency: VsCurrencyEnum.USD,
};
