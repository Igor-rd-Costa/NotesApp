import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreOptionsMenu } from './MoreOptionsMenu.component';

describe('MoreOptionsMenu', () => {
  let component: MoreOptionsMenu;
  let fixture: ComponentFixture<MoreOptionsMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MoreOptionsMenu]
    });
    fixture = TestBed.createComponent(MoreOptionsMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
