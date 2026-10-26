export const TOKEN_SERVICE_PORT = Symbol("TOKEN_SERVICE_PORT");

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface TokenServicePort {
  generateToken(payload: TokenPayload): string;
}
