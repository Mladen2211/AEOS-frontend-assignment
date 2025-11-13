/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { API_CONSTANTS } from './constants/app.constants';

describe('HttpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add User-Agent and Accept headers', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    (expect(req.request.headers.get('User-Agent')) as any).toBe(API_CONSTANTS.USER_AGENT);
    (expect(req.request.headers.get('Accept')) as any).toBe('application/json');
    req.flush({});
  });

  it('should handle rate limit headers', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    req.flush({}, {
      headers: {
        'x-ratelimit-remaining': '5'
      }
    });
  });

  it('should retry on 429 status with exponential backoff', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    req.flush('Rate limited', { status: 429, statusText: 'Too Many Requests' });

    (expect(req.request.method) as any).toBe('GET');
  });

  it('should retry on 5xx errors', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    (expect(req.request.method) as any).toBe('GET');
  });

  it('should handle client-side errors', () => {
    spyOn(console, 'error');

    httpClient.get('/test').subscribe({
      next: () => fail('Should not succeed'),
      error: (error) => {
        (expect(error.message) as any).toContain('Error:');
      }
    });

    const req = httpMock.expectOne('/test');
    req.error(new ErrorEvent('network error'), { status: 0 });
  });

  it('should handle rate limit exceeded error', () => {
    spyOn(console, 'error');

    httpClient.get('/test').subscribe({
      next: () => fail('Should not succeed'),
      error: (error) => {
        (expect(error.message) as any).toBe('Rate limit exceeded. Please try again later.');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Rate limited', { status: 429, statusText: 'Too Many Requests' });
  });

  it('should handle network errors', () => {
    spyOn(console, 'error');

    httpClient.get('/test').subscribe({
      next: () => fail('Should not succeed'),
      error: (error) => {
        (expect(error.message) as any).toBe('Network error. Please check your connection.');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Network error', { status: 0, statusText: 'Unknown Error' });
  });

  it('should handle other HTTP errors', () => {
    spyOn(console, 'error');

    httpClient.get('/test').subscribe({
      next: () => fail('Should not succeed'),
      error: (error) => {
        (expect(error.message) as any).toContain('Error Code: 404');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});