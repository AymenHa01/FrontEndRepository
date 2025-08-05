import { TestBed } from '@angular/core/testing';

import { AtelierServiceService } from './atelier-service.service';

describe('AtelierServiceService', () => {
  let service: AtelierServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtelierServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
