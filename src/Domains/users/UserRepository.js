class UserRepository {
  // eslint-disable-next-line no-unused-vars
  async addUser(_registerUser) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async verifyAvailableUsername(_username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async getPasswordByUsername(_username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // eslint-disable-next-line no-unused-vars
  async getIdByUsername(_username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default UserRepository;
