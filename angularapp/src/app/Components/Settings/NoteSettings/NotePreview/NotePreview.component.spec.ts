import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotePreview } from './NotePreview.component';

describe('NotePreview', () => {
  let component: NotePreview;
  let fixture: ComponentFixture<NotePreview>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotePreview]
    });
    fixture = TestBed.createComponent(NotePreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
