import { Inject, Injectable } from "@nestjs/common";
import { UserNotFoundError } from "../../../../common/domain/errors/domain.error";
import { USER_REPOSITORY_PORT, UserRepositoryPort } from "../ports/user.repository.port";
import { UserResponseDto } from "./register-user.use-case";

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
    };
  }
}
