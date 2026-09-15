import { GRPC } from '@cerbos/grpc';
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './document.controller';

describe('DocumentsController', () => {
  let controller: DocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [{ provide: GRPC, useValue: { isAllowed: jest.fn() } }],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
  });

  it('returns the document with the given id', async () => {
    await expect(controller.findOne('2')).resolves.toMatchObject({
      id: '2',
      author: 'user',
    });
  });

  it('returns undefined for an unknown id', async () => {
    await expect(controller.findOne('does-not-exist')).resolves.toBeUndefined();
  });
});
