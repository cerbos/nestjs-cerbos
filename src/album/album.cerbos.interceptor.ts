import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
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
    const resource = request.url.match(/[^/]+/g);
    const role = request.headers['authorization'];

    
    return next.handle().pipe(
      map(async (data) => {
        // this code, which is async, is called after the controller code is called
        // Therefore, the data variable will contain what the controller is returning

        const cerbosRequest = {
          principal: { id: role, roles: ['user'] },
          action: 'view:owner',
          resource: {
            kind: `${resource[0]}:object`,
            id: data.id,
            attributes: { public: true, owner: data.owner },
          },
        };

        // checking Cerbos for the result and wait for it!
        const cerbosResult = await cerbos.isAllowed(cerbosRequest);

        // If cerbos says no, return an exception
        if (cerbosResult === false) throw new ForbiddenException();

        // Cerbos says yes, so return the data
        return data;
      }),
    );
  }
}
