import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CerbosInterceptor } from './document.cerbos.interceptor';
import { getDocumentById } from '../db';

@Controller('document')
@UseInterceptors(CerbosInterceptor)
export class DocumentsController {
  @Get(':id')
  findOne(@Param('id') id: string): object {
    const document = getDocumentById(id);
    return document;
  }
}
