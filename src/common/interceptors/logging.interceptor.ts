import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    console.log(`[Request] ${method} ${url} started...`);

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `[Response] ${method} ${url} finished in ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
