import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderRevenue } from './provider-revenue';

describe('ProviderRevenue', () => {
  let component: ProviderRevenue;
  let fixture: ComponentFixture<ProviderRevenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderRevenue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderRevenue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
