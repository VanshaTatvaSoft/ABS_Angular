import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditService } from './add-edit-service';

describe('AddEditService', () => {
  let component: AddEditService;
  let fixture: ComponentFixture<AddEditService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
