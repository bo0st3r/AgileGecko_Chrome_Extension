import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionHyperlinkComponent } from './extension-hyperlink.component';

describe('ExtensionHyperlinkComponent', () => {
  let component: ExtensionHyperlinkComponent;
  let fixture: ComponentFixture<ExtensionHyperlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionHyperlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionHyperlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
