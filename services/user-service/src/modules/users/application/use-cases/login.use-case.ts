import { Inject, Injectable } from "@nestjs/common";
import { InvalidCredentialsError } from "../../../../common/domain/errors/domain.error";
import { PASSWORD_HASHER_PORT, PasswordHasherPort } from "../ports/password-hasher.port";
import { TOKEN_SERVICE_PORT, TokenServicePort } from "../ports/token-service.port";
import { USER_REPOSITORY_PORT, UserRepositoryPort } from "../ports/user.repository.port";

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string | null;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
