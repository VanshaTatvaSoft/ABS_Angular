import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayBreak } from './today-break';

describe('TodayBreak', () => {
  let component: TodayBreak;
  let fixture: ComponentFixture<TodayBreak>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayBreak]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayBreak);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
