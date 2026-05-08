import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { TranslocoHttpLoader } from './transloco-loader';

describe('TranslocoHttpLoader', () => {
  let loader: TranslocoHttpLoader;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    loader = TestBed.inject(TranslocoHttpLoader);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch the correct language file', async () => {
    const mockTranslations = { dashboard: { title: 'Market Overview' } };

    const promise = firstValueFrom(loader.getTranslation('en'));
    httpMock.expectOne('/i18n/en.json').flush(mockTranslations);
    const result = await promise;
    expect(result).toEqual(mockTranslations);
  });

  it('should use the lang parameter in the URL', () => {
    loader.getTranslation('es').subscribe();
    httpMock.expectOne('/i18n/es.json').flush({});
  });
});
