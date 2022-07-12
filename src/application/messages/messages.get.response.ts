import { Message } from '@domain/messages/message';

interface MessageDto {
  id: string;
  text: string;
  createdAt: Date;
}

class MessagesGetResponse {
  readonly messages: MessageDto[];

  constructor(messages: MessageDto[]) {
    this.messages = messages;
  }

  public static fromDomainModel(messages: Message[]): MessagesGetResponse {
    const transformedMessages = messages.map(m => {
      return { id: m.id, text: m.message, createdAt: m.createdAt };
    });
    return { messages: transformedMessages };
  }
}

export { MessagesGetResponse };
