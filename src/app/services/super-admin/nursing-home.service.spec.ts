import { TestBed } from '@angular/core/testing';

import { NursingHomeService } from './nursing-home.service';

describe('NursingHomeService', () => {
  let service: NursingHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NursingHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
