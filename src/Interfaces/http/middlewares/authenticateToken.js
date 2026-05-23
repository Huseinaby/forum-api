import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';

const authenticateToken = (container) => {
  return (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        throw new AuthenticationError('Missing authentication');
      }

      const token = authorizationHeader.split(' ')[1];

      if (!token) {
        throw new AuthenticationError('Missing authentication');
      }

      const authenticationTokenManager = container.getInstance('AuthenticationTokenManager');
      const decoded = authenticationTokenManager.verifyAccessToken(token);

      req.user = { id: decoded.id || decoded.userId };
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authenticateToken;
