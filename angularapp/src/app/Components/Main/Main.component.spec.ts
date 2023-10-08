import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Main } from './Main.component';

describe('Main', () => {
  let component: Main;
  let fixture: ComponentFixture<Main>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Main]
    });
    fixture = TestBed.createComponent(Main);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
