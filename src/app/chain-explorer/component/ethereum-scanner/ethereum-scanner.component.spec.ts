import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthereumScannerComponent } from './ethereum-scanner.component';

describe('EthereumScannerComponent', () => {
  let component: EthereumScannerComponent;
  let fixture: ComponentFixture<EthereumScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EthereumScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthereumScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
