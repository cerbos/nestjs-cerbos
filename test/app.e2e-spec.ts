import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

// These tests need a running Cerbos PDP with the policies from ./cerbos/policies.
// Start one with `npm run cerbos:start`.
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/ (GET)', () => {
    it('successfully returns content', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('/document/1 - owned by admin', () => {
    it('returns 403 when no authorization header is sent', () => {
      return request(app.getHttpServer()).get('/document/1').expect(403);
    });

    it('returns 403 when accessed with the "user" role', () => {
      return request(app.getHttpServer())
        .get('/document/1')
        .set('authorization', 'user')
        .expect(403);
    });

    it('returns 200 when accessed with the "admin" role', () => {
      return request(app.getHttpServer())
        .get('/document/1')
        .set('authorization', 'admin')
        .expect(200)
        .expect((res) => expect(res.body).toMatchObject({ id: '1' }));
    });
  });

  describe('/document/2 - owned by user', () => {
    it('returns 200 for its author', () => {
      return request(app.getHttpServer())
        .get('/document/2')
        .set('authorization', 'user')
        .expect(200);
    });

    it('returns 200 for an admin', () => {
      return request(app.getHttpServer())
        .get('/document/2')
        .set('authorization', 'admin')
        .expect(200);
    });
  });

  describe('/document/3 - owned by someone else', () => {
    it('returns 403 for the "user" role', () => {
      return request(app.getHttpServer())
        .get('/document/3')
        .set('authorization', 'user')
        .expect(403);
    });
  });

  describe('/document/unknown', () => {
    it('returns 404 when the document does not exist', () => {
      return request(app.getHttpServer())
        .get('/document/does-not-exist')
        .set('authorization', 'admin')
        .expect(404);
    });
  });
});
