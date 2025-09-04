import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePositionDialogComponent } from './create-position-dialog';

describe('CreatePositionDialog', () => {
  let component: CreatePositionDialogComponent;
  let fixture: ComponentFixture<CreatePositionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePositionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePositionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
