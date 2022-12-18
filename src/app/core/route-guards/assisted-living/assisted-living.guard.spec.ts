import { TestBed } from '@angular/core/testing';

import { AssistedLivingGuard } from './assisted-living.guard';

describe('AssistedLivingGuard', () => {
  let guard: AssistedLivingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AssistedLivingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
