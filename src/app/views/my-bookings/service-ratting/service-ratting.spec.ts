import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRatting } from './service-ratting';

describe('ServiceRatting', () => {
  let component: ServiceRatting;
  let fixture: ComponentFixture<ServiceRatting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRatting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRatting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
