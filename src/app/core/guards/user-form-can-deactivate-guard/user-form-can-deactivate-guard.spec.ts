import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { userFormCanDeactivateGuard } from './user-form-can-deactivate-guard';

describe('userFormCanDeactivateGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userFormCanDeactivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
