import request from 'supertest';

import { app } from '@test/bootstrap';

describe('Testing /login endpoint', () => {
  describe('[POST] /api/auth/login', () => {
    it('should return 200 OK', async () => {
      return request(app.getServer())
        .post('/api/auth/login')
        .send({
          name: 'Alice',
          password: 'qwerty12345',
        })
        .expect(200, {
          token:
            'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWxpY2UifQ.8nId6qAqyyoJtZWjedJHjuZ7CbbtvxFXuwOkGIGUqh5hZi-ClZkvg2Frw6dtQHsFgt9vhxfkJjNahZGgqLG4EQ',
        });
    });

    it('should return 404 Not Found when the crednetials are wrong', async () => {
      return request(app.getServer())
        .post('/api/auth/login')
        .send({
          name: 'wrong',
          password: 'creds',
        })
        .expect(404, {
          appVersion: '1.3.3',
          status: 404,
          code: 'Not Found',
          // eslint-disable-next-line no-use-before-define
          message: "User with provided credentials doesn't exist",
        });
    });
  });
});
