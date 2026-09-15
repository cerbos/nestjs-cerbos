import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { type Document, getDocumentById } from '../db';
import { CerbosInterceptor } from './document.cerbos.interceptor';

@Controller('document')
@UseInterceptors(CerbosInterceptor)
export class DocumentsController {
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Document | undefined> {
    return getDocumentById(id);
  }
}
