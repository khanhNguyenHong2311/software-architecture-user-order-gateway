import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client } from "minio";
import { StorageServicePort } from "../../application/ports/storage-service.port";

@Injectable()
export class MinioStorageService implements StorageServicePort, OnModuleInit {
  private client: Client;

  onModuleInit(): void {
    const endPoint = process.env.MINIO_ENDPOINT || "localhost";
    const port = parseInt(process.env.MINIO_PORT || "9000", 10);
    const accessKey = process.env.MINIO_ACCESS_KEY || "minioadmin";
    const secretKey = process.env.MINIO_SECRET_KEY || "minioadmin";
    const useSSL = process.env.MINIO_USE_SSL === "true";

    this.client = new Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });
  }

  async generatePresignedUploadUrl(bucket: string, objectName: string, expirySeconds: number): Promise<string> {
    try {
      const exists = await this.client.bucketExists(bucket);
      if (!exists) {
        await this.client.makeBucket(bucket, "us-east-1");
      }
    } catch {
      // ignore bucket error if already exists or permission
    }
    return this.client.presignedPutObject(bucket, objectName, expirySeconds);
  }
}
