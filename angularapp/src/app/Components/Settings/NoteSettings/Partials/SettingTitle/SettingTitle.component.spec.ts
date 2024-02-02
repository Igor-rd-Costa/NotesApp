import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingTitle } from './SettingTitle.component';

describe('SettingTitle', () => {
  let component: SettingTitle;
  let fixture: ComponentFixture<SettingTitle>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettingTitle]
    });
    fixture = TestBed.createComponent(SettingTitle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
