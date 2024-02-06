import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettings } from './ProfileSettings.component';

describe('ProfileSettings', () => {
  let component: ProfileSettings;
  let fixture: ComponentFixture<ProfileSettings>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfileSettings]
    });
    fixture = TestBed.createComponent(ProfileSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
