import { Controller, Get, SetMetadata, Param, UseInterceptors } from '@nestjs/common';
import { CerbosInterceptor } from './album.cerbos.interceptor';

@Controller('album')
@UseInterceptors(CerbosInterceptor)
export class AlbumsController {
  @Get(':id')
  @SetMetadata("required_role", "owner")
  findOne(@Param('id') id: string): object {
    return {
      id: "1",
      owner: 'user',
      url: 'https://placekitten.com/200/200'
    };
  }
}
