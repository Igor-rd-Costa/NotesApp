import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPopUp } from './AuthPopUp.component';

describe('AuthPopUp', () => {
  let component: AuthPopUp;
  let fixture: ComponentFixture<AuthPopUp>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthPopUp]
    });
    fixture = TestBed.createComponent(AuthPopUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
