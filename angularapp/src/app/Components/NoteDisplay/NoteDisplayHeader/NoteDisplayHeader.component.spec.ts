import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDisplayHeader } from './NoteDisplayHeader.component';

describe('NoteDisplayHeader', () => {
  let component: NoteDisplayHeader;
  let fixture: ComponentFixture<NoteDisplayHeader>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoteDisplayHeader]
    });
    fixture = TestBed.createComponent(NoteDisplayHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
