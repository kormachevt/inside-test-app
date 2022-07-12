import { PrismaClient } from '@prisma/client';

import { BaseUseCase } from '@application/shared/base.usecase';
import { Message } from '@domain/messages/message';
// import { DiContainer } from '@infrastructure/shared/di/di-container';
import { tokenProvider } from '@presentation/authentication';
import { UserNotFoundError } from '@presentation/errors/user-not-found.error';

import { MessagesPostRequest } from './messages.post.request';
import { MessagesPostResponse } from './messages.post.response';

class MessagesPostUseCase implements BaseUseCase<MessagesPostRequest, Promise<MessagesPostResponse>> {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute(request: MessagesPostRequest): Promise<MessagesPostResponse> {
    const nameFromToken = tokenProvider.parseToken(request.token)?.name;
    if (nameFromToken !== request.name) {
      throw new UserNotFoundError();
    }
    const user = await this.prisma.user.findFirst({
      where: {
        name: request.name
      }
    });

    if (user === null) {
      // TODO: Make a dedicated business error
      throw new UserNotFoundError();
    }

    const record = await this.prisma.messages.create({
      data: {
        message: request.message,
        userId: user.id
      }
    });
    const message = new Message(request.name, record.message, record.userId, record.id);
    return MessagesPostResponse.fromDomainModel(message);
  }
}

export { MessagesPostUseCase };
