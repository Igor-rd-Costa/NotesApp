import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteListMain } from './NoteListMain.component';

describe('NoteListMain', () => {
  let component: NoteListMain;
  let fixture: ComponentFixture<NoteListMain>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoteListMain]
    });
    fixture = TestBed.createComponent(NoteListMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
