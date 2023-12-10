import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Settings } from './Settings.component';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Settings]
    });
    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
