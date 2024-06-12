import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    Logger.log(`Validating request data: ${JSON.stringify(request.body)}`, 'ValidationInterceptor');
    return next.handle().pipe(
      tap(() => {
        Logger.log('Request data validated', 'ValidationInterceptor');
      }),
    );
  }
}
