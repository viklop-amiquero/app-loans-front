import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authListAppGuard } from './auth-list-app.guard';

describe('authListAppGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authListAppGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
