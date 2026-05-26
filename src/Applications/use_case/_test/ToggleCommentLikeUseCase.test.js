import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.js';

describe('ToggleCommentLikeUseCase', () => {
  it('should like comment when user has not liked it', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const userId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentExists = vi.fn().mockResolvedValue();
    mockCommentRepository.isCommentLikedByUser = vi.fn().mockResolvedValue(false);
    mockCommentRepository.likeComment = vi.fn().mockResolvedValue();
    mockCommentRepository.unlikeComment = vi.fn().mockResolvedValue();

    const useCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await useCase.execute(threadId, commentId, userId);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId);
    expect(mockCommentRepository.isCommentLikedByUser).toBeCalledWith(commentId, userId);
    expect(mockCommentRepository.likeComment).toBeCalledWith(commentId, userId);
    expect(mockCommentRepository.unlikeComment).not.toBeCalled();
  });

  it('should unlike comment when user has liked it', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const userId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = vi.fn().mockResolvedValue();
    mockCommentRepository.verifyCommentExists = vi.fn().mockResolvedValue();
    mockCommentRepository.isCommentLikedByUser = vi.fn().mockResolvedValue(true);
    mockCommentRepository.likeComment = vi.fn().mockResolvedValue();
    mockCommentRepository.unlikeComment = vi.fn().mockResolvedValue();

    const useCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await useCase.execute(threadId, commentId, userId);

    // Assert
    expect(mockCommentRepository.isCommentLikedByUser).toBeCalledWith(commentId, userId);
    expect(mockCommentRepository.unlikeComment).toBeCalledWith(commentId, userId);
    expect(mockCommentRepository.likeComment).not.toBeCalled();
  });
});
