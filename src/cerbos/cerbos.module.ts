import { GRPC } from '@cerbos/grpc';
import { Module } from '@nestjs/common';

/**
 * Provides a single shared Cerbos gRPC client to the rest of the application.
 *
 * Configure it with:
 * - `CERBOS_ADDRESS` (default `127.0.0.1:3593`): host and port of the Cerbos PDP gRPC endpoint.
 * - `CERBOS_TLS` (default `false`): set to `true` when the PDP is served over TLS.
 */
@Module({
  providers: [
    {
      provide: GRPC,
      useFactory: () =>
        new GRPC(process.env.CERBOS_ADDRESS ?? '127.0.0.1:3593', {
          tls: process.env.CERBOS_TLS === 'true',
        }),
    },
  ],
  exports: [GRPC],
})
export class CerbosModule {}
