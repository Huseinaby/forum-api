import AddedReply from '../../Domains/replies/entities/AddedReply.js';
import ReplyDetail from '../../Domains/replies/entities/ReplyDetail.js';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, commentId, owner) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, false) RETURNING id, content, owner',
      values: [id, commentId, content, owner, new Date()],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(replyId, userId) {
    await this.verifyReplyExists(replyId);
    await this.verifyReplyOwner(replyId, userId);

    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async verifyReplyExists(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    const { owner: replyOwner } = result.rows[0];

    if (replyOwner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki akses untuk menghapus balasan ini');
    }
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT r.id, u.username, r.created_at as date, r.content, r.is_delete
              FROM replies r
              LEFT JOIN users u ON r.owner = u.id
              WHERE r.comment_id = $1
              ORDER BY r.created_at ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new ReplyDetail({
      id: row.id,
      username: row.username,
      date: row.date,
      content: row.content,
      isDelete: row.is_delete,
    }));
  }
}

export default ReplyRepositoryPostgres;
