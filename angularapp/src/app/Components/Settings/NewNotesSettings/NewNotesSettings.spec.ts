import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNotesSettings } from './NewNotesSettings.component';

describe('NewNotesSettings', () => {
  let component: NewNotesSettings;
  let fixture: ComponentFixture<NewNotesSettings>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewNotesSettings]
    });
    fixture = TestBed.createComponent(NewNotesSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
