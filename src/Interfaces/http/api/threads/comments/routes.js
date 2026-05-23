import express from 'express';
import authenticateToken from '../../../middlewares/authenticateToken.js';
import replies from './replies/index.js';

const createCommentsRouter = (handler, container) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', authenticateToken(container), handler.postCommentHandler);
  router.delete('/:commentId', authenticateToken(container), handler.deleteCommentHandler);
  router.use('/:commentId/replies', replies(container));

  return router;
};

export default createCommentsRouter;
