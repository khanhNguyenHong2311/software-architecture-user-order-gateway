import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { TokenPayload, TokenServicePort } from "../../application/ports/token-service.port";

@Injectable()
export class JwtTokenService implements TokenServicePort {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_ACCESS_SECRET || "super-secret-jwt-key-min-32-characters-long!";
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: "1h" });
  }
}
