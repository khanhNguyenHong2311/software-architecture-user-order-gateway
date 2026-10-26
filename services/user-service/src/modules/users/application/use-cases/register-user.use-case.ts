import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { EmailAlreadyExistsError } from "../../../../common/domain/errors/domain.error";
import { User } from "../../domain/entities/user.entity";
import { PASSWORD_HASHER_PORT, PasswordHasherPort } from "../ports/password-hasher.port";
import { USER_REPOSITORY_PORT, UserRepositoryPort } from "../ports/user.repository.port";

export interface RegisterUserDto {
  email: string;
  fullName: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(dto: RegisterUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new EmailAlreadyExistsError(dto.email);
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const user = new User({
      id: randomUUID(),
      email: dto.email,
      fullName: dto.fullName,
      passwordHash,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
    };
  }
}
