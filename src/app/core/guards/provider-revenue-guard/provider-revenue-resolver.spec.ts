import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { providerRevenueResolver } from './provider-revenue-resolver';

describe('providerRevenueResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => providerRevenueResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
