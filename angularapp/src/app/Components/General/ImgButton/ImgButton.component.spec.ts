import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgButton } from './ImgButton.component';

describe('ImgButton', () => {
  let component: ImgButton;
  let fixture: ComponentFixture<ImgButton>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImgButton]
    });
    fixture = TestBed.createComponent(ImgButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
