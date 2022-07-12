import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { ApiError } from './api.error';

class ValidationError extends ApiError {
  constructor(value: string, constraint: string) {
    super(
      StatusCodes.BAD_REQUEST,
      ReasonPhrases.BAD_REQUEST,
      `Value [${value}] doesn't satisfy its constraint: [${constraint}]`
    );
  }
}

export { ValidationError };
