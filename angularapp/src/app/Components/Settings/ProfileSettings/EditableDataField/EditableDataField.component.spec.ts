import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableDataField } from './EditableDataField.component';

describe('EditableDataField', () => {
  let component: EditableDataField;
  let fixture: ComponentFixture<EditableDataField>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditableDataField]
    });
    fixture = TestBed.createComponent(EditableDataField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
