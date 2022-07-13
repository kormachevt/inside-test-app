import { Message } from '@domain/messages/message';

class MessagesPostResponse {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  public static fromDomainModel(message: Message): MessagesPostResponse {
    return new MessagesPostResponse(message.id);
  }
}

export { MessagesPostResponse };
