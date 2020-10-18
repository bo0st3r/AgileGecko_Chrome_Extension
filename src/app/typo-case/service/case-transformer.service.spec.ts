import { TestBed } from '@angular/core/testing';

import { CaseTransformerService } from './case-transformer.service';

describe('CaseTransformerService', () => {
  let service: CaseTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseTransformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
