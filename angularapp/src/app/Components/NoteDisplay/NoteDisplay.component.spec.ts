import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDisplay } from './NoteDisplay.component';

describe('NoteDisplay', () => {
  let component: NoteDisplay;
  let fixture: ComponentFixture<NoteDisplay>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoteDisplay]
    });
    fixture = TestBed.createComponent(NoteDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
