import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionTabComponent } from './extension-tab.component';

describe('ExtensionTabComponent', () => {
  let component: ExtensionTabComponent;
  let fixture: ComponentFixture<ExtensionTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
