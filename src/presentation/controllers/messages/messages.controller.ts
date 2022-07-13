import { StatusCodes } from 'http-status-codes';
import { Body, HeaderParam, HttpCode, JsonController, Post, UseBefore } from 'routing-controllers';

import { MessagesGetResponse } from '@application/messages/messages.get.response';
import { MessagesPostRequest } from '@application/messages/messages.post.request';
import { MessagesPostResponse } from '@application/messages/messages.post.response';
import { MessagesPostUseCase } from '@application/messages/messages.post.usecase';
import { tokenProvider } from '@presentation/authentication';
import { AuthenticationMiddleware } from '@presentation/middlewares';

@JsonController('/messages')
class MessagesController {
  private messagesPostUseCase: MessagesPostUseCase;

  constructor(messagesPostUseCase: MessagesPostUseCase) {
    this.messagesPostUseCase = messagesPostUseCase;
  }

  @Post()
  @HttpCode(StatusCodes.CREATED)
  @UseBefore(AuthenticationMiddleware)
  async post(
    @Body() body: { message: string; name: string },
    @HeaderParam('Authorization') authHeader: string
  ): Promise<MessagesPostResponse | MessagesGetResponse> {
    const token = tokenProvider.getTokenFromHeader(authHeader);

    return this.messagesPostUseCase.execute(new MessagesPostRequest(body.name, body.message, token));
  }
}

export { MessagesController };
