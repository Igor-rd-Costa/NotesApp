import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Index } from './Index.component';

describe('Index', () => {
  let component: Index;
  let fixture: ComponentFixture<Index>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Index]
    });
    fixture = TestBed.createComponent(Index);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
