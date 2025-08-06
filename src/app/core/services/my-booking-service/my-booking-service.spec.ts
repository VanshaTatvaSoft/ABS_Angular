import { TestBed } from '@angular/core/testing';

import { MyBookingService } from './my-booking-service';

describe('MyBookingService', () => {
  let service: MyBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
