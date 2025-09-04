import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsTableComponent } from './positions-table';

describe('PositionsTable', () => {
  let component: PositionsTableComponent;
  let fixture: ComponentFixture<PositionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
