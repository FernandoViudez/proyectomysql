import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './app-routing.module';
import { Routes } from '@angular/router';

describe('AppRoutingModule', () => {
  let routes: Routes;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), AppRoutingModule],
    });

    routes = TestBed.inject(RouterTestingModule).config;
  });

  it('should have a route for inicio', () => {
    const route = routes.find((r) => r.path === 'inicio');
    expect(route).toBeTruthy();
    expect(route?.loadChildren).toBeDefined();
  });

  it('should redirect empty path to inicio', () => {
    const route = routes.find((r) => r.path === '');
    expect(route).toBeTruthy();
    expect(route?.redirectTo).toBe('inicio');
  });

  it('should redirect unknown paths to inicio', () => {
    const route = routes.find((r) => r.path === '**');
    expect(route).toBeTruthy();
    expect(route?.redirectTo).toBe('inicio');
  });

  it('should have a route for altamp with UserGuard', () => {
    const route = routes.find((r) => r.path === 'altamp');
    expect(route).toBeTruthy();
    expect(route?.canActivate).toBeDefined();
    expect(route?.component?.name).toBe('AltampComponent');
  });

  // Add more tests for other routes as needed
});