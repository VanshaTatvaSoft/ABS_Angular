import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnpushExample } from './onpush-example';

describe('OnpushExample', () => {
  let component: OnpushExample;
  let fixture: ComponentFixture<OnpushExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnpushExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnpushExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
