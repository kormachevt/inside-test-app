class Message {
  readonly name: string;

  readonly message: string;

  readonly userId: string;

  readonly id: string;

  readonly createdAt: Date;

  constructor(name: string, message: string, userId: string, id: string, createdAt: Date) {
    this.name = name;
    this.message = message;
    this.userId = userId;
    this.id = id;
    this.createdAt = createdAt;
  }
}

export { Message };
