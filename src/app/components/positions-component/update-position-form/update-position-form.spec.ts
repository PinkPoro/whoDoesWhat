import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePositionsFormComponent } from './update-position-form';

describe('PositionsForm', () => {
  let component: UpdatePositionsFormComponent;
  let fixture: ComponentFixture<UpdatePositionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePositionsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePositionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
