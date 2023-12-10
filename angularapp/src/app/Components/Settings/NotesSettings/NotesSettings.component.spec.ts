import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesSettings } from './NotesSettings.component';

describe('NotesSettings', () => {
  let component: NotesSettings;
  let fixture: ComponentFixture<NotesSettings>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotesSettings]
    });
    fixture = TestBed.createComponent(NotesSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
