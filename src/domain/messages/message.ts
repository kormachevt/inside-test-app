class Message {
  readonly name: string;

  readonly message: string;

  readonly userId: string;

  readonly id: string;

  constructor(name: string, message: string, userId: string, id: string) {
    this.name = name;
    this.message = message;
    this.userId = userId;
    this.id = id;
  }
}

export { Message };
