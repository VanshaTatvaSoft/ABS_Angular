import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEarning } from './my-earning';

describe('MyEarning', () => {
  let component: MyEarning;
  let fixture: ComponentFixture<MyEarning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEarning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEarning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
