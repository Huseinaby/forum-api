class CommentRepository {
  // eslint-disable-next-line no-unused-vars
  async addComment(_threadId, _newComment, _owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async deleteComment(_commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async verifyCommentExists(_commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async verifyCommentOwner(_commentId, _owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async getCommentsByThreadId(_threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async isCommentLikedByUser(_commentId, _userId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async likeComment(_commentId, _userId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async unlikeComment(_commentId, _userId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default CommentRepository;
