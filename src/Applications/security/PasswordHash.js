class PasswordHash {
  // eslint-disable-next-line no-unused-vars
  async hash(_password) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async comparePassword(_plain, _encrypted) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}

export default PasswordHash;
