import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/prisma/prisma.service";
import { UserRepositoryPort } from "../../application/ports/user.repository.port";
import { User } from "../../domain/entities/user.entity";

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    if (!record) return null;
    return new User({
      id: record.id,
      email: record.email,
      fullName: record.fullName,
      passwordHash: record.passwordHash,
      avatarUrl: record.avatarUrl,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    if (!record) return null;
    return new User({
      id: record.id,
      email: record.email,
      fullName: record.fullName,
      passwordHash: record.passwordHash,
      avatarUrl: record.avatarUrl,
    });
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        passwordHash: user.passwordHash,
        avatarUrl: user.avatarUrl,
      },
    });
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: user.fullName,
        passwordHash: user.passwordHash,
        avatarUrl: user.avatarUrl,
      },
    });
  }
}
