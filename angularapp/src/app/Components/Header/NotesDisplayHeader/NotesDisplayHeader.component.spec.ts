import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDisplayHeader } from './NotesDisplayHeader.component';

describe('NotesDisplayHeaderComponent', () => {
  let component: NotesDisplayHeader;
  let fixture: ComponentFixture<NotesDisplayHeader>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotesDisplayHeader]
    });
    fixture = TestBed.createComponent(NotesDisplayHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
