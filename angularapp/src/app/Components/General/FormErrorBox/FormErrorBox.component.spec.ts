import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorBox } from './FormErrorBox.component';

describe('FormErrorBox', () => {
  let component: FormErrorBox;
  let fixture: ComponentFixture<FormErrorBox>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormErrorBox]
    });
    fixture = TestBed.createComponent(FormErrorBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
