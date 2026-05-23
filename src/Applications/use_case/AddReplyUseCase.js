import NewReply from '../../Domains/replies/entities/NewReply.js';

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, useCasePayload, owner) {
    // Verify thread exists
    await this._threadRepository.verifyThreadExists(threadId);
    // Verify comment exists
    await this._commentRepository.verifyCommentExists(commentId);

    const newReply = new NewReply(useCasePayload);
    return this._replyRepository.addReply(newReply, commentId, owner);
  }
}

export default AddReplyUseCase;
