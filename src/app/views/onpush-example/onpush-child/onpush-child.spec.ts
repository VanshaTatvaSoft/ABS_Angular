import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnpushChild } from './onpush-child';

describe('OnpushChild', () => {
  let component: OnpushChild;
  let fixture: ComponentFixture<OnpushChild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnpushChild]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnpushChild);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
