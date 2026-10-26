import { Inject, Injectable } from "@nestjs/common";
import { UserNotFoundError } from "../../../../common/domain/errors/domain.error";
import { STORAGE_SERVICE_PORT, StorageServicePort } from "../ports/storage-service.port";
import { USER_REPOSITORY_PORT, UserRepositoryPort } from "../ports/user.repository.port";

export interface GetAvatarUploadUrlDto {
  userId: string;
  fileName: string;
}

export interface PresignedUrlResponseDto {
  uploadUrl: string;
  avatarUrl: string;
}

@Injectable()
export class GetAvatarUploadUrlUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(STORAGE_SERVICE_PORT)
    private readonly storageService: StorageServicePort,
  ) {}

  async execute(dto: GetAvatarUploadUrlDto): Promise<PresignedUrlResponseDto> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new UserNotFoundError(dto.userId);
    }

    const bucket = process.env.MINIO_BUCKET || "avatars";
    const cleanFileName = dto.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectName = `${dto.userId}/${Date.now()}-${cleanFileName}`;
    const uploadUrl = await this.storageService.generatePresignedUploadUrl(bucket, objectName, 300);

    const minioHost = process.env.MINIO_ENDPOINT || "localhost";
    const minioPort = process.env.MINIO_PORT || "9000";
    const avatarUrl = `http://${minioHost}:${minioPort}/${bucket}/${objectName}`;

    user.updateAvatarUrl(avatarUrl);
    await this.userRepository.update(user);

    return {
      uploadUrl,
      avatarUrl,
    };
  }
}
