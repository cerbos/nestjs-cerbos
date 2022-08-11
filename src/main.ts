import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CerbosAuthGuard } from './app.cerbos.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Applying a global Guard for Cerbos
  app.useGlobalGuards(new CerbosAuthGuard());
  await app.listen(3000);
}
bootstrap();
