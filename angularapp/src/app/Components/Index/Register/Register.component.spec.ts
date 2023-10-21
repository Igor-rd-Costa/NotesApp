import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './Register.component';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Register]
    });
    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
