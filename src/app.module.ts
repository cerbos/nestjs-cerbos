import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumsController } from './album/album.controller';

@Module({
  imports: [],
  controllers: [AppController, AlbumsController],
  providers: [AppService],
})
export class AppModule {}
