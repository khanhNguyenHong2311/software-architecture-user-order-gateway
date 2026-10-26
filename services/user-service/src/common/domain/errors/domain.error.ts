export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
  }
}

export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`Email already in use: ${email}`);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super("Invalid email or password");
  }
}
