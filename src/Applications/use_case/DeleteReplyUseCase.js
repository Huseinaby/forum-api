class DeleteReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, replyId, userId) {
    // Verify thread exists
    await this._threadRepository.verifyThreadExists(threadId);
    // Verify comment exists
    await this._commentRepository.verifyCommentExists(commentId);
    // Delete reply (this will also verify ownership)
    await this._replyRepository.deleteReply(replyId, userId);
  }
}

export default DeleteReplyUseCase;
