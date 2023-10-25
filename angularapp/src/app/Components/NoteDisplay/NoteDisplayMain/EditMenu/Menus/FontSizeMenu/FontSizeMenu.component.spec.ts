import { ComponentFixture, TestBed } from '@angular/core/testing';
    
import { FontSizeMenu } from './FontSizeMenu.component';

describe('FontSizeMenu', () => {
  let component: FontSizeMenu;
  let fixture: ComponentFixture<FontSizeMenu>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FontSizeMenu]
    });
    fixture = TestBed.createComponent(FontSizeMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
