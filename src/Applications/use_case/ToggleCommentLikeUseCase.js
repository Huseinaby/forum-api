class ToggleCommentLikeUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);

    const isLiked = await this._commentRepository.isCommentLikedByUser(commentId, userId);

    if (isLiked) {
      await this._commentRepository.unlikeComment(commentId, userId);
      return;
    }

    await this._commentRepository.likeComment(commentId, userId);
  }
}

export default ToggleCommentLikeUseCase;
