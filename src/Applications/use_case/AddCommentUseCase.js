import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, useCasePayload, owner) {
    await this._threadRepository.verifyThreadExists(threadId);
    const newComment = new NewComment(useCasePayload);
    return this._commentRepository.addComment(threadId, newComment, owner);
  }
}

export default AddCommentUseCase;
