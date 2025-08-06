import { TestBed } from '@angular/core/testing';

import { SweetToastService } from './sweet-toast.service';

describe('SweetToastService', () => {
  let service: SweetToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SweetToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
