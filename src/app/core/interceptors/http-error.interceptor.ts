import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error) => {
      const status = error.status ?? 0;
      let summary = 'Request Failed';
      let detail = 'An unexpected error occurred. Please try again.';

      if (status === 0) {
        summary = 'Network Error';
        detail = 'Unable to reach the server. Check your connection.';
      } else if (status === 429) {
        summary = 'Rate Limited';
        detail = 'Too many requests. Please wait a moment and try again.';
      } else if (status >= 400 && status < 500) {
        summary = `Client Error (${status})`;
        detail = error.error?.message ?? 'The request could not be processed.';
      } else if (status >= 500) {
        summary = `Server Error (${status})`;
        detail = 'The server encountered an error. Please try again later.';
      }

      messageService.add({
        severity: 'error',
        summary,
        detail,
        life: 5000,
      });
      console.log(error, 'Error here')
      return throwError(() => error);
    }),
  );
};
