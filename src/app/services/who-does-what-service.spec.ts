import { TestBed } from '@angular/core/testing';

import { WhoDoesWhatService } from './who-does-what-service';

describe('WhoDoesWhatService', () => {
  let service: WhoDoesWhatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhoDoesWhatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
