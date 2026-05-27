import AddedComment from '../../Domains/comments/entities/AddedComment.js';
import CommentRepository from '../../Domains/comments/CommentRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(threadId, newComment, owner) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, false) RETURNING id, content, owner',
      values: [id, threadId, content, owner, new Date()],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    const { owner: commentOwner } = result.rows[0];

    if (commentOwner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki akses untuk menghapus komentar ini');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.id, u.username, c.created_at as date, c.content, c.is_delete, COALESCE(cl.like_count, 0) as like_count
              FROM comments c
              LEFT JOIN users u ON c.owner = u.id
              LEFT JOIN (
                SELECT comment_id, COUNT(*)::int as like_count
                FROM user_comment_likes
                GROUP BY comment_id
              ) cl ON cl.comment_id = c.id
              WHERE c.thread_id = $1
              ORDER BY c.created_at ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async isCommentLikedByUser(commentId, userId) {
    const query = {
      text: 'SELECT 1 FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    return !!result.rowCount;
  }

  async likeComment(commentId, userId) {
    const query = {
      text: 'INSERT INTO user_comment_likes (comment_id, owner) VALUES ($1, $2)',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async unlikeComment(commentId, userId) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }
}

export default CommentRepositoryPostgres;
