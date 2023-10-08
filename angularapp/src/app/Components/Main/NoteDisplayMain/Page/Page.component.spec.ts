import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page } from './Page.component';

describe('Page', () => {
  let component: Page;
  let fixture: ComponentFixture<Page>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Page]
    });
    fixture = TestBed.createComponent(Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
