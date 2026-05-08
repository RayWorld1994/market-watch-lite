import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const transloco = inject(TranslocoService);

  return next(req).pipe(
    catchError((error) => {
      const status = error.status ?? 0;
      let summary = transloco.translate('error.requestFailed');
      let detail = transloco.translate('error.unexpected');

      if (status === 0) {
        summary = transloco.translate('error.networkError');
        detail = transloco.translate('error.networkDetail');
      } else if (status === 429) {
        summary = transloco.translate('error.rateLimited');
        detail = transloco.translate('error.rateLimitedDetail');
      } else if (status >= 400 && status < 500) {
        summary = transloco.translate('error.clientError', { status });
        detail = error.error?.message ?? transloco.translate('error.clientErrorDetail');
      } else if (status >= 500) {
        summary = transloco.translate('error.serverError', { status });
        detail = transloco.translate('error.serverErrorDetail');
      }

      messageService.add({
        severity: 'error',
        summary,
        detail,
        life: 5000,
      });

      return throwError(() => error);
    }),
  );
};
