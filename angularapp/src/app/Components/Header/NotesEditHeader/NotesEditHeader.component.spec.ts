import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesEditHeader } from './NotesEditHeader.component';

describe('NotesEditHeader', () => {
  let component: NotesEditHeader;
  let fixture: ComponentFixture<NotesEditHeader>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotesEditHeader]
    });
    fixture = TestBed.createComponent(NotesEditHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
