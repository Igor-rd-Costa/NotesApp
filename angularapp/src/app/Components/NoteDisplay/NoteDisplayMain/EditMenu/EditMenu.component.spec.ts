import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMenu } from './EditMenu.component';

describe('EditMenu', () => {
  let component: EditMenu;
  let fixture: ComponentFixture<EditMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditMenu]
    });
    fixture = TestBed.createComponent(EditMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
