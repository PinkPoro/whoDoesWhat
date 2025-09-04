import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoDoesWhatContainerComponent } from './who-does-what-container.component';

describe('WhoDoesWhat', () => {
  let component: WhoDoesWhatContainerComponent;
  let fixture: ComponentFixture<WhoDoesWhatContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhoDoesWhatContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoDoesWhatContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
