import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCard } from './NoteCard.component';

describe('NoteCard', () => {
  let component: NoteCard;
  let fixture: ComponentFixture<NoteCard>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoteCard]
    });
    fixture = TestBed.createComponent(NoteCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
