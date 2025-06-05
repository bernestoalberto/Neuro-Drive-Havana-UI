import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropComponent } from './drag-drop.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('DragDropComponent', () => {
  let component: DragDropComponent;
  let fixture: ComponentFixture<DragDropComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
