import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinSearchInputComponent } from './coin-search-input.component';

describe('CoinSearchInputComponent', () => {
  let component: CoinSearchInputComponent;
  let fixture: ComponentFixture<CoinSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinSearchInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
