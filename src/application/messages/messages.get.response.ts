import { Message } from '@domain/messages/message';

interface MessageDto {
  id: string;
  name: string;
  text: string;
  created_at: Date;
}

class MessagesGetResponse {
  readonly messages: MessageDto[];

  constructor(messages: MessageDto[]) {
    this.messages = messages;
  }

  public static fromDomainModel(messages: Message[]): MessagesGetResponse {
    const transformedMessages = messages.map(m => {
      return {
        id: m.id,
        name: m.name,
        text: m.message,
        created_at: m.createdAt
      };
    });
    return { messages: transformedMessages };
  }
}

export { MessagesGetResponse };
