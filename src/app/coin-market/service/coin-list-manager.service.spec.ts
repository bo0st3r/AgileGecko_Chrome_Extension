import { TestBed } from '@angular/core/testing';

import { CoinListManagerService } from './coin-list-manager.service';

describe('CoinListManagerService', () => {
  let service: CoinListManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoinListManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
