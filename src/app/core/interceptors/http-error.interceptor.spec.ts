import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { httpErrorInterceptor } from './http-error.interceptor';

describe('httpErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let messageService: { add: ReturnType<typeof vi.fn> };
  let translocoService: { translate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    messageService = { add: vi.fn() };
    translocoService = { translate: vi.fn((key: string) => key) };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: messageService },
        { provide: TranslocoService, useValue: translocoService },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should show toast and rethrow on 500 error', async () => {
    const promise = firstValueFrom(http.get('/api/test')).catch(() => {});
    httpMock.expectOne('/api/test').flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    await promise;
    expect(messageService.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error' }),
    );
  });

  it('should translate network error messages for status 0', async () => {
    const promise = firstValueFrom(http.get('/api/test')).catch(() => {});
    httpMock.expectOne('/api/test').error(new ProgressEvent('error'), { status: 0 });
    await promise;
    expect(translocoService.translate).toHaveBeenCalledWith('error.networkError');
    expect(translocoService.translate).toHaveBeenCalledWith('error.networkDetail');
  });

  it('should translate rate limit messages for status 429', async () => {
    const promise = firstValueFrom(http.get('/api/test')).catch(() => {});
    httpMock.expectOne('/api/test').flush('', { status: 429, statusText: 'Too Many Requests' });
    await promise;
    expect(translocoService.translate).toHaveBeenCalledWith('error.rateLimited');
    expect(translocoService.translate).toHaveBeenCalledWith('error.rateLimitedDetail');
  });

  it('should handle 4xx client errors', async () => {
    const promise = firstValueFrom(http.get('/api/test')).catch(() => {});
    httpMock.expectOne('/api/test').flush('', { status: 404, statusText: 'Not Found' });
    await promise;
    expect(translocoService.translate).toHaveBeenCalledWith('error.clientError', { status: 404 });
  });

  it('should not add toast for successful requests', async () => {
    const promise = firstValueFrom(http.get('/api/test'));
    httpMock.expectOne('/api/test').flush({ data: 'ok' });
    await promise;
    expect(messageService.add).not.toHaveBeenCalled();
  });
});
