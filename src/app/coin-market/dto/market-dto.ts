/**
 * Represents a cryptocurrency's market from CoinGecko.
 */
import {CoinDto} from './coin-dto';

export interface MarketDto extends CoinDto {
  image: string,
  currentPrice: number,
  marketCap: number,
  marketCapRank: number,
  fullyDilutedValuation: number,
  totalVolume: number,
  high24h: number,
  low24h: number,
  priceChange24h: number,
  priceChangePercentage24h: number,
  marketCapChange24h: number,
  marketCapChangePercentage24h: number,
  circulatingSupply: number,
  totalSupply: number,
  maxSupply: number,
  ath: number,
  athChangePercentage: number,
  athDate: Date,
  atl: number,
  atlChangePercentage: number,
  atlDate: Date,
  roi: number,
  lastUpdated: Date
}
