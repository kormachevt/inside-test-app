import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { Body, HttpCode, JsonController, Post } from 'routing-controllers';

import { tokenProvider } from '@presentation/authentication';
import { UserNotFoundError } from '@presentation/errors/user-not-found.error';

import { PostMessageUseCase } from './post.usecase';

const prisma = new PrismaClient();

@JsonController('/messages')
class MessagesController {
  @Post()
  @HttpCode(StatusCodes.CREATED)
  async post(@Body() message: PostMessageUseCase): Promise<null> {
    const user = await prisma.user.findFirst({
      where: {
        name: usecase.name,
      },
    });

    if (user === null || usecase.password !== user.password) {
      throw new UserNotFoundError();
    } else {
      return new LoginResponse(
        tokenProvider.createAccessToken(user.id, user.name).token
      );
    }
  }
}

export { MessagesController };
