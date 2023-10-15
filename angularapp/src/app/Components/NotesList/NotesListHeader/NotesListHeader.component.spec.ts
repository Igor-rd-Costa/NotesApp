import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesListHeader } from './NotesListHeader.component';

describe('NotesListHeader', () => {
  let component: NotesListHeader;
  let fixture: ComponentFixture<NotesListHeader>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotesListHeader]
    });
    fixture = TestBed.createComponent(NotesListHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
