import { TestBed } from '@angular/core/testing';

import { CoinGeckoRepositoryService } from './coin-gecko-repository.service';

describe('CoingeckoRepositoryService', () => {
  let service: CoinGeckoRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoinGeckoRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
