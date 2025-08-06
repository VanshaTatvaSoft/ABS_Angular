import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSlot } from './select-slot';

describe('SelectSlot', () => {
  let component: SelectSlot;
  let fixture: ComponentFixture<SelectSlot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSlot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSlot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
