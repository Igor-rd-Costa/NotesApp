import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDisplayMain } from './NoteDisplayMain.component'

describe('NoteDisplayMain', () => {
  let component: NoteDisplayMain;
  let fixture: ComponentFixture<NoteDisplayMain>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoteDisplayMain]
    });
    fixture = TestBed.createComponent(NoteDisplayMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
