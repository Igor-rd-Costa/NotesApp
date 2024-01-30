import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberInput } from './NumberInput.component';

describe('NumberInput', () => {
  let component: NumberInput;
  let fixture: ComponentFixture<NumberInput>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NumberInput]
    });
    fixture = TestBed.createComponent(NumberInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
