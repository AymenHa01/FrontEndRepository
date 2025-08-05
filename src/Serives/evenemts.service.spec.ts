import { TestBed } from '@angular/core/testing';

import { EvenemtsService } from './evenemts.service';

describe('EvenemtsService', () => {
  let service: EvenemtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvenemtsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
