import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexErrorBox } from './IndexErrorBox.component';

describe('IndexErrorBox', () => {
  let component: IndexErrorBox;
  let fixture: ComponentFixture<IndexErrorBox>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndexErrorBox]
    });
    fixture = TestBed.createComponent(IndexErrorBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
