import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanitizationExample } from './sanitization-example';

describe('SanitizationExample', () => {
  let component: SanitizationExample;
  let fixture: ComponentFixture<SanitizationExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SanitizationExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanitizationExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
