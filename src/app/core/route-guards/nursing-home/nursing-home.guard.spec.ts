import { TestBed } from '@angular/core/testing';

import { NursingHomeGuard } from './nursing-home.guard';

describe('NursingHomeGuard', () => {
  let guard: NursingHomeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NursingHomeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
