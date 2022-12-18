import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq;
    authReq = request.clone({
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'SessionId': 'uigygyu'
      })
    });
    if(this.authService.isUserLoggedIn()){
      authReq = request.clone({
        
        headers: new HttpHeaders({
          'token': `${this.authService.get()}`
        })
      });
    } else {
      authReq = request.clone();
    }

    return next.handle(authReq)
      .pipe(
        tap((evt: HttpEvent<any>) => {
          if (evt instanceof HttpResponse) {
          }
        }),
        catchError((response: HttpErrorResponse) => {
          if (response.status === 401) {
            this.authService.logout();
            this.router.navigateByUrl('login');
          }
          if (response.error instanceof ErrorEvent) {
          }
          if (response.error instanceof ProgressEvent) {
          }
          return throwError(response);
        })
      );
  }
}
