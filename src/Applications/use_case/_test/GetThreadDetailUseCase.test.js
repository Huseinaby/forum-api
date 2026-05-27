import { vi } from 'vitest';
import ThreadDetail from '../../../Domains/threads/entities/ThreadDetail.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThreadData = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
        likeCount: 2,
        like_count: 2,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2021-08-08T07:59:48.766Z',
        content: 'sebuah balasan',
        is_delete: false,
      },
    ];

    /** dummy object for expected result */
    const expectedThreadDetail = new ThreadDetail({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          likeCount: 2,
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              date: '2021-08-08T07:59:48.766Z',
              content: 'sebuah balasan',
            },
          ],
        },
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve(mockThreadData));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentId = vi.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');
  });

  it('should throw NotFoundError when thread not found', async () => {
    // Arrange
    const threadId = 'thread-invalid';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => {
        throw new Error('thread tidak ditemukan');
      });

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action and Assert
    await expect(getThreadDetailUseCase.execute(threadId))
      .rejects.toThrowError('thread tidak ditemukan');
  });
});
