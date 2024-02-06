import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultNoteSettings } from './DefaultNoteSettings.component';

describe('DefaultNoteSettings', () => {
  let component: DefaultNoteSettings;
  let fixture: ComponentFixture<DefaultNoteSettings>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DefaultNoteSettings]
    });
    fixture = TestBed.createComponent(DefaultNoteSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
