import express from 'express';
import authenticateToken from '../../../../middlewares/authenticateToken.js';

const createRepliesRouter = (handler, container) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', authenticateToken(container), handler.postReplyHandler);
  router.delete('/:replyId', authenticateToken(container), handler.deleteReplyHandler);

  return router;
};

export default createRepliesRouter;
