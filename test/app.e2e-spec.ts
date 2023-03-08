import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/ (GET)', () => {
    it('Succesfully return content', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('/document/1 - Admin', () => {
    it('Return 403 (forbitten), when accessed with incorrect header', () => {
      return request(app.getHttpServer()).get('/document/1').expect(403);
    });
    it('Return 403 (forbitten), when accessed with role of "user".', () => {
      return request(app.getHttpServer())
        .get('/document/1')
        .set('authorization', 'user')
        .expect(403);
    });
    it('Return 200 (success), when accessed with role of "admin".', () => {
      return request(app.getHttpServer())
        .get('/document/1')
        .set('authorization', 'admin')
        .expect(200);
    });
  });
});
