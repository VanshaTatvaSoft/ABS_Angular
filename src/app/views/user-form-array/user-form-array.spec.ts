import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormArray } from './user-form-array';

describe('UserFormArray', () => {
  let component: UserFormArray;
  let fixture: ComponentFixture<UserFormArray>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormArray]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormArray);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
