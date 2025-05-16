import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedWordInputComponent } from './reserved-word-input.component';

describe('ReservedWordInputComponent', () => {
  let component: ReservedWordInputComponent;
  let fixture: ComponentFixture<ReservedWordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservedWordInputComponent],
      declarations: [] // Add any additional declarations if needed
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservedWordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
