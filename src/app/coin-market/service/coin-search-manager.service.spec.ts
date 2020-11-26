import { TestBed } from '@angular/core/testing';

import { CoinSearchManagerService } from './coin-search-manager.service';

describe('CoinSearchManagerService', () => {
  let service: CoinSearchManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoinSearchManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
