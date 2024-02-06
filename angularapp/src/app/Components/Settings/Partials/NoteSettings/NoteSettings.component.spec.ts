import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSettings } from './NoteSettings.component';

describe('NoteSettings', () => {
  let component: NoteSettings;
  let fixture: ComponentFixture<NoteSettings>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoteSettings]
    });
    fixture = TestBed.createComponent(NoteSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
