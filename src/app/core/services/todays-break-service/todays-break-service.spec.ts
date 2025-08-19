import { TestBed } from '@angular/core/testing';

import { TodaysBreakService } from './todays-break-service';

describe('TodaysBreakService', () => {
  let service: TodaysBreakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodaysBreakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
