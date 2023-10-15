import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesList } from './NotesList.component';

describe('NotesList', () => {
  let component: NotesList;
  let fixture: ComponentFixture<NotesList>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotesList]
    });
    fixture = TestBed.createComponent(NotesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
