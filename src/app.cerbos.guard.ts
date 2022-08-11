import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GRPC as Cerbos } from '@cerbos/grpc';
const cerbos = new Cerbos('127.0.0.1:3593', { tls: false });
const ACTIONS = { POST: 'create', GET: 'view:public', PUT: 'update' };

@Injectable()
export class CerbosAuthGuard implements CanActivate {
  canActivate(host: ExecutionContext): Promise<boolean> {

    // This function will allow Cerbos to check if the request can go through
    // globally, before any controller code is called upon

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const resource = request.url.match(/[^/]+/g);

    const isAllowed = cerbos.isAllowed({
      principal: { id: 'public', roles: ['user'] },
      resource: {
        kind: `${resource[0]}:object`,
        id: resource[1],
      },
      action: ACTIONS[request.method],
    });

    // We're returning a promise here, which will resolve into a boolean allowing the 
    // call to continue or fail.
    return isAllowed;
  }
}
