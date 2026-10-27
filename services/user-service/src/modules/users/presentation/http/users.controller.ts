import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../../../common/domain/errors/domain.error";
import { GetAvatarUploadUrlUseCase } from "../../application/use-cases/get-avatar-upload-url.use-case";
import { GetProfileUseCase } from "../../application/use-cases/get-profile.use-case";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { GetAvatarUploadUrlRequestDto } from "./dto/get-avatar-upload-url.request.dto";
import { LoginRequestDto } from "./dto/login.request.dto";
import { RegisterUserRequestDto } from "./dto/register-user.request.dto";

@Controller("users")
export class UsersController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly getAvatarUploadUrlUseCase: GetAvatarUploadUrlUseCase,
  ) {}

  @Post("register")
  async register(@Body() dto: RegisterUserRequestDto) {
    try {
      return await this.registerUserUseCase.execute(dto);
    } catch (err) {
      if (err instanceof EmailAlreadyExistsError) {
        throw new ConflictException(err.message);
      }
      throw err;
    }
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto) {
    try {
      return await this.loginUseCase.execute(dto);
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(err.message);
      }
      throw err;
    }
  }

  @Get("me")
  async getMyProfile(@Headers("x-user-id") userId?: string) {
    if (!userId) {
      throw new UnauthorizedException("Missing x-user-id header");
    }
    try {
      return await this.getProfileUseCase.execute(userId);
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  @Post("avatar/presigned-url")
  @HttpCode(HttpStatus.OK)
  async getAvatarUploadUrl(
    @Headers("x-user-id") userId: string | undefined,
    @Body() dto: GetAvatarUploadUrlRequestDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException("Missing x-user-id header");
    }
    try {
      return await this.getAvatarUploadUrlUseCase.execute({
        userId,
        fileName: dto.fileName,
      });
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }
}
