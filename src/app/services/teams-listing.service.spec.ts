import { TestBed } from '@angular/core/testing';

import { TeamsListingService } from './teams-listing.service';

describe('TeamsListingService', () => {
  let service: TeamsListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamsListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
