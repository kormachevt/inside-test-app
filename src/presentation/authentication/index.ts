import { Action } from 'routing-controllers';

import { Token } from '@presentation/authentication/token';

import { JwtTokenProvider } from './jwt-token-provider';

const tokenProvider = new JwtTokenProvider();

const checkUser = async (action: Action): Promise<Token | undefined> => {
  const token = tokenProvider.getTokenFromHeader(action.request.headers.authorization);
  return tokenProvider.parseToken(token);
};

export { checkUser, tokenProvider };
