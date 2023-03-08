import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GRPC as Cerbos } from '@cerbos/grpc';
const cerbos = new Cerbos('127.0.0.1:3593', { tls: false });

@Injectable()
export class CerbosInterceptor implements NestInterceptor {
  intercept(host: ExecutionContext, next: CallHandler): Observable<any> {
    // This code is initated before the controller code is called
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    // const resource = request.url.match(/[^/]+/g);
    const role = request.headers['authorization'] || 'anonymous';

    return next.handle().pipe(
      map(async (document) => {
        // If the document doesn't exist, throw an exception
        if (!document) return new BadRequestException('Invalid document id');

        // this code, which is async, is called after the controller code is called
        // Therefore, the data variable will contain what the controller is returning
        const cerbosRequest = {
          principal: { id: role, roles: [role] },
          action: 'view',
          resource: {
            kind: 'document',
            id: document.id,
            attributes: document,
          },
        };

        // checking Cerbos for the result and wait for it!
        const cerbosResult = await cerbos.isAllowed(cerbosRequest);

        // If cerbos says no, return an exception
        if (cerbosResult === false) throw new ForbiddenException();

        // Cerbos says yes, so return the data
        return document;
      }),
    );
  }
}
