import { TestBed } from '@angular/core/testing';

import { HttpOptionsGeneratorService } from './http-options-generator.service';

describe('OptionsGeneratorService', () => {
  let service: HttpOptionsGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpOptionsGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
