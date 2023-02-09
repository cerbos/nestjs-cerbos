import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsController } from './document/document.controller';

@Module({
  imports: [],
  controllers: [AppController, DocumentsController],
  providers: [AppService],
})
export class AppModule {}
