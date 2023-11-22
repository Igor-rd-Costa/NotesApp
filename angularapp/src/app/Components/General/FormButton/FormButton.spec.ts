import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormButton } from './FormButton';

describe('FormButton', () => {
  let component: FormButton;
  let fixture: ComponentFixture<FormButton>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormButton]
    });
    fixture = TestBed.createComponent(FormButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
