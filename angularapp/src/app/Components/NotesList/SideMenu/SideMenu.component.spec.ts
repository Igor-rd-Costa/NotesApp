import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenu } from './SideMenu.component';

describe('SideMenu', () => {
  let component: SideMenu;
  let fixture: ComponentFixture<SideMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SideMenu]
    });
    fixture = TestBed.createComponent(SideMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
