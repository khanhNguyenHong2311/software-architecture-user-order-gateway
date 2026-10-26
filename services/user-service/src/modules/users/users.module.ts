import { Module } from "@nestjs/common";
import { PrismaService } from "../../common/infrastructure/prisma/prisma.service";
import { PASSWORD_HASHER_PORT } from "./application/ports/password-hasher.port";
import { STORAGE_SERVICE_PORT } from "./application/ports/storage-service.port";
import { TOKEN_SERVICE_PORT } from "./application/ports/token-service.port";
import { USER_REPOSITORY_PORT } from "./application/ports/user.repository.port";
import { GetAvatarUploadUrlUseCase } from "./application/use-cases/get-avatar-upload-url.use-case";
import { GetProfileUseCase } from "./application/use-cases/get-profile.use-case";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { RegisterUserUseCase } from "./application/use-cases/register-user.use-case";
import { PrismaUserRepository } from "./infrastructure/persistence/prisma-user.repository";
import { BcryptPasswordHasher } from "./infrastructure/security/bcrypt-password-hasher";
import { JwtTokenService } from "./infrastructure/security/jwt-token.service";
import { MinioStorageService } from "./infrastructure/storage/minio-storage.service";
import { UsersController } from "./presentation/http/users.controller";

@Module({
  controllers: [UsersController],
  providers: [
    PrismaService,
    RegisterUserUseCase,
    LoginUseCase,
    GetProfileUseCase,
    GetAvatarUploadUrlUseCase,
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    {
      provide: PASSWORD_HASHER_PORT,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_SERVICE_PORT,
      useClass: JwtTokenService,
    },
    {
      provide: STORAGE_SERVICE_PORT,
      useClass: MinioStorageService,
    },
  ],
})
export class UsersModule {}
