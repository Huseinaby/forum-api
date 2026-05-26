class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, isDelete, likeCount,
    } = payload;

    this.id = id;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
    this.date = date;
    this.username = username;
    this.likeCount = likeCount;
  }

  _verifyPayload({
    id, content, date, username, isDelete, likeCount,
  }) {
    if (!id || !content || !date || !username || typeof isDelete === 'undefined' || typeof likeCount === 'undefined') {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof username !== 'string'
      || typeof isDelete !== 'boolean'
      || typeof likeCount !== 'number'
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default CommentDetail;
