import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignService } from './assign-service';

describe('AssignService', () => {
  let component: AssignService;
  let fixture: ComponentFixture<AssignService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
