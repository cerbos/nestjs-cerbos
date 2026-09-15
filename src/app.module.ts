import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CerbosModule } from './cerbos/cerbos.module';
import { DocumentsController } from './document/document.controller';

@Module({
  imports: [CerbosModule],
  controllers: [AppController, DocumentsController],
  providers: [AppService],
})
export class AppModule {}
