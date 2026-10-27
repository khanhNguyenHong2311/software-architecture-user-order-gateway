import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_ACCESS_SECRET || "super-secret-jwt-key-min-32-characters-long!";
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path;

    if (
      path.endsWith("/users/register") ||
      path.endsWith("/users/login")
    ) {
      return true;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid Authorization header");
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, this.secret) as { userId: string; email: string };
      (request as any).user = decoded;
      request.headers["x-user-id"] = decoded.userId;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
