import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorDialogService } from '../components/error/error-dialog.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorDialog = inject(ErrorDialogService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error?.message) {
        errorMessage = error.error.message;
      }

      errorDialog.showError(errorMessage);
      return throwError(() => error);
    })
  );
};
