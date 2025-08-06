import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProvider } from './edit-provider';

describe('EditProvider', () => {
  let component: EditProvider;
  let fixture: ComponentFixture<EditProvider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProvider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProvider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
