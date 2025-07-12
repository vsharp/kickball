import { TestBed } from '@angular/core/testing';

import { EditsTrackerService } from './edits-tracker.service';

describe('EditsTrackerService', () => {
  let service: EditsTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditsTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
