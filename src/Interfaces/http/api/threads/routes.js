import express from 'express';
import authenticateToken from '../../middlewares/authenticateToken.js';
import comments from './comments/index.js';

const createThreadsRouter = (handler, container) => {
  const router = express.Router();

  router.post('/', authenticateToken(container), handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadDetailHandler);
  router.use('/:threadId/comments', comments(container));

  return router;
};

export default createThreadsRouter;
