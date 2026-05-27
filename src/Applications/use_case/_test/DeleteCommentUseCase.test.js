import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import DeleteCommentUseCase from '../DeleteCommentUseCase.js';

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const userId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(threadId, commentId, userId);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentId, userId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(commentId);
  });

  it('should throw NotFoundError when thread not found', async () => {
    // Arrange
    const threadId = 'thread-invalid';
    const commentId = 'comment-123';
    const userId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => {
        throw new Error('thread tidak ditemukan');
      });
    mockCommentRepository.verifyCommentExists = vi.fn();
    mockCommentRepository.verifyCommentOwner = vi.fn();
    mockCommentRepository.deleteComment = vi.fn();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(deleteCommentUseCase.execute(threadId, commentId, userId))
      .rejects.toThrowError('thread tidak ditemukan');

    expect(mockCommentRepository.verifyCommentExists).not.toBeCalled();
    expect(mockCommentRepository.verifyCommentOwner).not.toBeCalled();
    expect(mockCommentRepository.deleteComment).not.toBeCalled();
  });

  it('should throw NotFoundError when comment not found', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-invalid';
    const userId = 'user-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = vi.fn()
      .mockImplementation(() => {
        throw new Error('Anda tidak memiliki akses untuk menghapus komentar ini');
      });
    mockCommentRepository.deleteComment = vi.fn();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(deleteCommentUseCase.execute(threadId, commentId, userId))
      .rejects.toThrowError('Anda tidak memiliki akses untuk menghapus komentar ini');

    expect(mockCommentRepository.deleteComment).not.toBeCalled();
  });

  it('should throw AuthorizationError when user is not comment owner', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const userId = 'user-invalid';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = vi.fn()
      .mockImplementation(() => {
        throw new Error('komentar tidak ditemukan');
      });
    mockCommentRepository.verifyCommentOwner = vi.fn();
    mockCommentRepository.deleteComment = vi.fn();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(deleteCommentUseCase.execute(threadId, commentId, userId))
      .rejects.toThrowError('komentar tidak ditemukan');

    expect(mockCommentRepository.verifyCommentOwner).not.toBeCalled();
    expect(mockCommentRepository.deleteComment).not.toBeCalled();
  });
});
