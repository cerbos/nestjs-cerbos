import { GRPC } from '@cerbos/grpc';
import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { lastValueFrom, of } from 'rxjs';
import type { Document } from '../db';
import { CerbosInterceptor } from './document.cerbos.interceptor';

const document: Document = {
  id: '1',
  title: 'Secret Admin Document',
  author: 'admin',
  description: 'admin only',
  icon: '🔒',
};

const contextWithHeaders = (
  headers: Record<string, string>,
): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({
        header: (name: string) => headers[name.toLowerCase()],
      }),
    }),
  }) as unknown as ExecutionContext;

const handlerReturning = (value: Document | undefined): CallHandler => ({
  handle: () => of(value),
});

describe('CerbosInterceptor', () => {
  let interceptor: CerbosInterceptor;
  let isAllowed: jest.Mock;

  beforeEach(async () => {
    isAllowed = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        CerbosInterceptor,
        { provide: GRPC, useValue: { isAllowed } },
      ],
    }).compile();

    interceptor = module.get(CerbosInterceptor);
  });

  it('returns the document when Cerbos allows the action', async () => {
    isAllowed.mockResolvedValue(true);

    const result = await lastValueFrom(
      interceptor.intercept(
        contextWithHeaders({ authorization: 'admin' }),
        handlerReturning(document),
      ),
    );

    expect(result).toEqual(document);
    expect(isAllowed).toHaveBeenCalledWith({
      principal: { id: 'admin', roles: ['admin'] },
      action: 'view',
      resource: { kind: 'document', id: '1', attributes: document },
    });
  });

  it('throws ForbiddenException when Cerbos denies the action', async () => {
    isAllowed.mockResolvedValue(false);

    await expect(
      lastValueFrom(
        interceptor.intercept(
          contextWithHeaders({ authorization: 'user' }),
          handlerReturning(document),
        ),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('treats a missing authorization header as the anonymous principal', async () => {
    isAllowed.mockResolvedValue(false);

    await expect(
      lastValueFrom(
        interceptor.intercept(
          contextWithHeaders({}),
          handlerReturning(document),
        ),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(isAllowed).toHaveBeenCalledWith(
      expect.objectContaining({
        principal: { id: 'anonymous', roles: ['anonymous'] },
      }),
    );
  });

  it('throws NotFoundException without calling Cerbos when there is no document', async () => {
    await expect(
      lastValueFrom(
        interceptor.intercept(
          contextWithHeaders({ authorization: 'admin' }),
          handlerReturning(undefined),
        ),
      ),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(isAllowed).not.toHaveBeenCalled();
  });
});
