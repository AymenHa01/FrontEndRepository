import { TestBed } from '@angular/core/testing';

import { SArtistService } from './s-artist.service';

describe('SArtistService', () => {
  let service: SArtistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SArtistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
