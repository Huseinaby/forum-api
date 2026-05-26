export const up = (pgm) => {
  pgm.createTable('user_comment_likes', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    // eslint-disable-next-line camelcase
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments',
      onDelete: 'cascade',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('user_comment_likes', 'unique_comment_like_by_owner', {
    unique: ['comment_id', 'owner'],
  });
};

export const down = (pgm) => {
  pgm.dropTable('user_comment_likes');
};
