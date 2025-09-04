import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsContainerComponent } from './positions-container.component';

describe('PositionsContainer', () => {
  let component: PositionsContainerComponent;
  let fixture: ComponentFixture<PositionsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
