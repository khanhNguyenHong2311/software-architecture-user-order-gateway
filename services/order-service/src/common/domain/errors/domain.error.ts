export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class OrderNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Order not found: ${id}`);
  }
}
