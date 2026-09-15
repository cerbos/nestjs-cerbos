import { GRPC } from '@cerbos/grpc';
import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { from, Observable, switchMap } from 'rxjs';
import type { Document } from '../db';

type Principal = { id: string; roles: string[] };

/**
 * Asks Cerbos whether the current principal may `view` the document returned
 * by the controller. Because this runs *after* the handler, the full document
 * (including its attributes) is available for the policy to evaluate.
 */
@Injectable()
export class CerbosInterceptor implements NestInterceptor<
  Document | undefined,
  Document
> {
  constructor(private readonly cerbos: GRPC) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<Document | undefined>,
  ): Observable<Document> {
    const request = context.switchToHttp().getRequest<Request>();

    // Demo only: the role is read straight from the `authorization` header.
    // In a real application derive the principal from a proper auth guard (e.g. JWT).
    const role = request.header('authorization') ?? 'anonymous';
    const principal: Principal = { id: role, roles: [role] };

    return next
      .handle()
      .pipe(switchMap((document) => from(this.authorize(principal, document))));
  }

  private async authorize(
    principal: Principal,
    document: Document | undefined,
  ): Promise<Document> {
    if (!document) throw new NotFoundException('Document not found');

    const allowed = await this.cerbos.isAllowed({
      principal,
      action: 'view',
      resource: {
        kind: 'document',
        id: document.id,
        attributes: document,
      },
    });

    if (!allowed) throw new ForbiddenException();

    return document;
  }
}
