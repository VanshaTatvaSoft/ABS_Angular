import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { entryGuardGuard } from './entry-guard-guard';

describe('entryGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => entryGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
