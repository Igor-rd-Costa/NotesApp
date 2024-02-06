import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSettingsItem } from './NoteSettingsItem.component';

describe('NoteSettingsItem', () => {
  let component: NoteSettingsItem;
  let fixture: ComponentFixture<NoteSettingsItem>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoteSettingsItem]
    });
    fixture = TestBed.createComponent(NoteSettingsItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
