import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalToObservable } from './signal-to-observable';

describe('SignalToObservable', () => {
  let component: SignalToObservable;
  let fixture: ComponentFixture<SignalToObservable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalToObservable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalToObservable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
