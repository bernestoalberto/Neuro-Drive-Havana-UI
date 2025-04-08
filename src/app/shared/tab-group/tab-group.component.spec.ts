import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabGroupAiComponent } from './tab-group-component';

describe('TabGroupAiComponent', () => {
  let component: TabGroupAiComponent;
  let fixture: ComponentFixture<TabGroupAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabGroupAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabGroupAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
