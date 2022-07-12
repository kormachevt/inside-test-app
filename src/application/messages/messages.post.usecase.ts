import { PrismaClient, User } from '@prisma/client';

import { BaseUseCase } from '@application/shared/base.usecase';
import { Message } from '@domain/messages/message';
import { tokenProvider } from '@presentation/authentication';
import { ValidationError } from '@presentation/errors';
import { UserNotFoundError } from '@presentation/errors/user-not-found.error';

import { MessagesGetResponse } from './messages.get.response';
import { MessagesPostRequest } from './messages.post.request';
import { MessagesPostResponse } from './messages.post.response';

class MessagesPostUseCase
  implements BaseUseCase<MessagesPostRequest, Promise<MessagesPostResponse | MessagesGetResponse>>
{
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute(request: MessagesPostRequest): Promise<MessagesPostResponse | MessagesGetResponse> {
    this.assertSenderIsAuthenticatedUser(request.token, request.name);
    const user = await this.getUser(request.name);

    const isHistoryRequest = request.message.includes('history');
    if (isHistoryRequest) {
      return this.doGetHistory(request, user);
    }

    return this.doPostMessage(request, user);
  }

  private async doGetHistory(request: MessagesPostRequest, user: User) {
    const limit = this.getHistoryLimit(request.message);
    const messageRecords = await this.getMessageRecords(user, limit);
    return MessagesGetResponse.fromDomainModel(
      messageRecords.map(m => new Message(request.name, m.message, user.id, m.id, m.createdAt))
    );
  }

  private async doPostMessage(request: MessagesPostRequest, user: User) {
    const record = await this.recordMessage(request.message, user.id);
    const message = new Message(request.name, record.message, record.userId, record.id, record.createdAt);
    return MessagesPostResponse.fromDomainModel(message);
  }

  private async getMessageRecords(user: User, limit: number) {
    return this.prisma.messages.findMany({
      where: {
        user: user
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }

  private getHistoryLimit(message: string) {
    const limit = Number.parseInt(message.split(' ')[1]);
    if (Number.isNaN(limit)) {
      throw new ValidationError('message count', 'should be an integer');
    }
    if (limit <= 0) {
      throw new ValidationError('message count', 'should be > 0');
    }
    return limit;
  }

  private async getUser(name: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        name: name
      }
    });
    if (user === null) {
      // TODO: Make a dedicated business error
      throw new UserNotFoundError();
    }
    return user;
  }

  private async recordMessage(message: string, userId: string) {
    return this.prisma.messages.create({
      data: {
        message: message,
        userId: userId
      }
    });
  }

  private assertSenderIsAuthenticatedUser(token: string, sender: string) {
    const nameFromToken = tokenProvider.parseToken(token)?.name;
    if (nameFromToken !== sender) {
      throw new UserNotFoundError();
    }
  }
}

export { MessagesPostUseCase };
