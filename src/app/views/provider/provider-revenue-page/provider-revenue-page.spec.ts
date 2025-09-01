import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderRevenuePage } from './provider-revenue-page';

describe('ProviderRevenuePage', () => {
  let component: ProviderRevenuePage;
  let fixture: ComponentFixture<ProviderRevenuePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderRevenuePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderRevenuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
