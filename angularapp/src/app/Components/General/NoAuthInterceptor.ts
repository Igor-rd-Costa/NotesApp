import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";

@Injectable()
export class NoAuthInterceptor implements HttpInterceptor {

    constructor(private router : Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(tap({ 
            next: () => {},
            error: (err : any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status !== 401 && err.status !== 0)
                        return;

                    this.router.navigate(["login"]);
                }
            }
        }));
    }

}
