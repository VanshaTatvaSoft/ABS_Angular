import { TestBed } from '@angular/core/testing';

import { UserSignal } from './user-signal';

describe('UserSignal', () => {
  let service: UserSignal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSignal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
