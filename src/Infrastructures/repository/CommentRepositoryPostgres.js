import AddedComment from '../../Domains/comments/entities/AddedComment.js';
import CommentDetail from '../../Domains/comments/entities/CommentDetail.js';
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

  async deleteComment(commentId, userId) {
    await this.verifyCommentExists(commentId);
    await this.verifyCommentOwner(commentId, userId);

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
      text: `SELECT c.id, u.username, c.created_at as date, c.content, c.is_delete
              FROM comments c
              LEFT JOIN users u ON c.owner = u.id
              WHERE c.thread_id = $1
              ORDER BY c.created_at ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new CommentDetail({
      id: row.id,
      username: row.username,
      date: row.date,
      content: row.content,
      isDelete: row.is_delete,
    }));
  }
}

export default CommentRepositoryPostgres;
