import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMenu } from './ListMenu.component';

describe('ListMenu', () => {
  let component: ListMenu;
  let fixture: ComponentFixture<ListMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListMenu]
    });
    fixture = TestBed.createComponent(ListMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
