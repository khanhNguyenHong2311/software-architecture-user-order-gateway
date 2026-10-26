import { IsNotEmpty, IsString } from "class-validator";

export class GetAvatarUploadUrlRequestDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
