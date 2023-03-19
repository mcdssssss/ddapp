import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/web';
import { Application } from 'egg';
import * as assert from 'assert';

describe('test/controller/home.test.ts', () => {

  let app: Application;

  beforeAll(async () => {
    // create app
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  it('should GET /', async () => {
    // make request
    const result = await createHttpRequest(app).get('/');

    // use expect by jest
    expect(result.status).toBe(200);
    expect(result.text).toBe('Hello Midwayjs!');

    // or use assert
    assert.deepStrictEqual(result.status, 200);
    assert.deepStrictEqual(result.text, 'Hello Midwayjs!');
  });

});
