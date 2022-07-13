import request from 'supertest';

import { app } from '@test/bootstrap';

const token =
  'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWxpY2UifQ.8nId6qAqyyoJtZWjedJHjuZ7CbbtvxFXuwOkGIGUqh5hZi-ClZkvg2Frw6dtQHsFgt9vhxfkJjNahZGgqLG4EQ';

describe('Testing /messages endpoint', () => {
  describe('[POST] /api/messages', () => {
    it('should return 201 Created and id of recorded message when authenticated user submits a message', async () => {
      const response = await request(app.getServer())
        .post('/api/messages')
        .set('Authorization', token)
        .send({
          name: 'Alice',
          message: 'Hello darkness my old friend',
        });
      expect(response.status).toEqual(201);
      expect(Object.keys(response.body)).toEqual(['id']);
      expect(response.body.id.length).toEqual(36);
    });

    // Also better to provide different SC but no time to dig deeper
    it('should return 201 Created and last %n% messages of the user when authenticated user submits a message', async () => {
      const response = await request(app.getServer())
        .post('/api/messages')
        .set('Authorization', token)
        .send({
          name: 'Alice',
          message: 'history 1',
        });
      expect(response.status).toEqual(201);
      expect(Object.keys(response.body)).toEqual(['messages']);
      expect(Object.keys(response.body.messages).length).toEqual(1);
      expect(Object.keys(response.body.messages[0])).toEqual([
        'id',
        'name',
        'text',
        'created_at',
      ]);
      expect(response.body.messages[0].name).toEqual('Alice');
    });

    // Yes there are couple of corner cases here when "history blah blah" can be considered a valid message to post but:
    // 1. Messing getting history and posting a message into a single endpoint is bad
    // 2. Not enought time to handle all this corner cases
    it('should return 400 Bad Request for getting message history when message count in request is not a number', async () => {
      return await request(app.getServer())
        .post('/api/messages')
        .set('Authorization', token)
        .send({
          name: 'Alice',
          message: 'history blah',
        })
        .expect(400, {
          appVersion: '1.3.3',
          status: 400,
          code: 'Bad Request',
          message:
            // eslint-disable-next-line no-use-before-define
            "Value [message count] doesn't satisfy its constraint: [should be an integer]",
        });
    });

    ['0', '-1'].forEach((limit) =>
      it(`should return 400 Bad Request for getting message history when message count is = [${limit}]`, async () => {
        return await request(app.getServer())
          .post('/api/messages')
          .set('Authorization', token)
          .send({
            name: 'Alice',
            message: 'history ' + limit,
          })
          .expect(400, {
            appVersion: '1.3.3',
            status: 400,
            code: 'Bad Request',
            message:
              // eslint-disable-next-line no-use-before-define
              "Value [message count] doesn't satisfy its constraint: [should be > 0]",
          });
      })
    );

    it('should return 404 Not Found for getting message history when name in request differs from name in token', async () => {
      return await request(app.getServer())
        .post('/api/messages')
        .set('Authorization', token)
        .send({
          name: 'Mike',
          message: 'history 1',
        })
        .expect(404, {
          appVersion: '1.3.3',
          status: 404,
          code: 'Not Found',
          // eslint-disable-next-line no-use-before-define
          message: "User with provided credentials doesn't exist",
        });
    });

    it('should return 404 Not Found for posting a message when name in message differs from name in token', async () => {
      return await request(app.getServer())
        .post('/api/messages')
        .set('Authorization', token)
        .send({
          name: 'Mike',
          message: 'Hello World',
        })
        .expect(404, {
          appVersion: '1.3.3',
          status: 404,
          code: 'Not Found',
          // eslint-disable-next-line no-use-before-define
          message: "User with provided credentials doesn't exist",
        });
    });

    it('should return 401 Unauthorized when token is not provided', async () => {
      return await request(app.getServer())
        .post('/api/messages')
        .send({
          name: 'Alice',
          message: 'Hello World',
        })
        .expect(401, {
          appVersion: '1.3.3',
          status: 401,
          code: 'unauthorized',
          message: '🚫 Missing or invalid token.',
        });
    });
  });
});
