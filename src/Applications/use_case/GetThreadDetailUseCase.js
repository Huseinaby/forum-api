import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';

const mapCommentRowToDetail = (comment) => ({
  id: comment.id,
  username: comment.username,
  date: comment.date,
  content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
  likeCount: comment.like_count,
});

const mapReplyRowToDetail = (reply) => ({
  id: reply.id,
  username: reply.username,
  date: reply.date,
  content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
});

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
        return {
          ...mapCommentRowToDetail(comment),
          replies: replies.map(mapReplyRowToDetail),
        };
      }),
    );

    return new ThreadDetail({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: commentsWithReplies,
    });
  }
}

export default GetThreadDetailUseCase;
