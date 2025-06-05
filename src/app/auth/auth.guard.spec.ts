import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { describe, beforeEach, it, expect } from 'vitest';
import {AuthGuard}  from './auth.guard';

const authGuard = (AuthGuard as any).ɵfac as CanActivateFn;

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
