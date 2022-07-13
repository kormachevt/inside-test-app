import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { ApiError } from './api.error';

class UserNotFoundError extends ApiError {
  constructor() {
    super(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, `User with provided credentials doesn't exist`);
  }
}

export { UserNotFoundError };
