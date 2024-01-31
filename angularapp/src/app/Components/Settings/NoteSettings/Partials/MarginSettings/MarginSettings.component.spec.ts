import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginSettings } from './MarginSettings.component';

describe('MarginSettings', () => {
  let component: MarginSettings;
  let fixture: ComponentFixture<MarginSettings>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarginSettings]
    });
    fixture = TestBed.createComponent(MarginSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
