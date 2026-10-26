export const STORAGE_SERVICE_PORT = Symbol("STORAGE_SERVICE_PORT");

export interface StorageServicePort {
  generatePresignedUploadUrl(bucket: string, objectName: string, expirySeconds: number): Promise<string>;
}
