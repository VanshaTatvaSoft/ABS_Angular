import { TestBed } from '@angular/core/testing';

import { BreakFormFactoryService } from './break-form-factory-service';

describe('BreakFormFactoryService', () => {
  let service: BreakFormFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreakFormFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
