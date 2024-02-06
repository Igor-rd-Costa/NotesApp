import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundColorSettings } from './BackgroundColorSettings.component';

describe('BackgroundColorSettings', () => {
  let component: BackgroundColorSettings;
  let fixture: ComponentFixture<BackgroundColorSettings>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BackgroundColorSettings]
    });
    fixture = TestBed.createComponent(BackgroundColorSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
