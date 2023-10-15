import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesListMain } from './NotesListMain.component';

describe('NotesListMain', () => {
  let component: NotesListMain;
  let fixture: ComponentFixture<NotesListMain>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotesListMain]
    });
    fixture = TestBed.createComponent(NotesListMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
