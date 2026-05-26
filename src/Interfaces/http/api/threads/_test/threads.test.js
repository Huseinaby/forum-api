import request from 'supertest';

import pool from '../../../../../Infrastructures/database/postgres/pool.js';
import UsersTableTestHelper from '../../../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../../../tests/CommentsTableTestHelper.js';
import container from '../../../../../Infrastructures/container.js';
import createServer from '../../../../../Infrastructures/http/createServer.js';

describe('HTTP API - Threads', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const loginRes = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });

      const { accessToken } = loginRes.body.data;

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'sebuah thread',
          body: 'sebuah body thread',
        });

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
      expect(response.body.data.addedThread.title).toEqual('sebuah thread');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const loginRes = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });

      const { accessToken } = loginRes.body.data;

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'only title' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const loginRes = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });

      const { accessToken } = loginRes.body.data;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });

      const threadId = threadRes.body.data.addedThread.id;

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah comment' });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
      expect(response.body.data.addedComment.content).toEqual('sebuah comment');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const loginRes = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });

      const { accessToken } = loginRes.body.data;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });

      const threadId = threadRes.body.data.addedThread.id;

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and toggle like status for a comment', async () => {
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const loginRes = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });

      const { accessToken } = loginRes.body.data;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });

      const threadId = threadRes.body.data.addedThread.id;

      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah comment' });

      const commentId = commentRes.body.data.addedComment.id;

      const firstToggleResponse = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(firstToggleResponse.status).toEqual(200);
      expect(firstToggleResponse.body.status).toEqual('success');

      const likedThreadDetail = await request(app).get(`/threads/${threadId}`);
      expect(likedThreadDetail.body.data.thread.comments[0].likeCount).toEqual(1);

      const secondToggleResponse = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(secondToggleResponse.status).toEqual(200);
      expect(secondToggleResponse.body.status).toEqual('success');

      const unlikedThreadDetail = await request(app).get(`/threads/${threadId}`);
      expect(unlikedThreadDetail.body.data.thread.comments[0].likeCount).toEqual(0);
    });

    it('should response 401 when request does not have access token', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes');

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
    });
  });
});
