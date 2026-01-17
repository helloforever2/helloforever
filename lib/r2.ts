import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as getPresignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client configured for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const bucketName = process.env.R2_BUCKET_NAME || "helloforever-messages";
const publicUrl = process.env.R2_PUBLIC_URL || "";

/**
 * Upload a file to R2 storage
 * @param file - File buffer to upload
 * @param fileName - Name/path for the file in the bucket
 * @param contentType - MIME type of the file
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Return the public URL
    return `${publicUrl}/${fileName}`;
  } catch (error) {
    console.error("R2 upload error:", error);
    throw new Error("Failed to upload file to storage");
  }
}

/**
 * Generate a presigned URL for direct browser uploads
 * @param fileName - Name/path for the file in the bucket
 * @param contentType - MIME type of the file
 * @returns Presigned URL valid for 5 minutes
 */
export async function getSignedUploadUrl(
  fileName: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: contentType,
    });

    const uploadUrl = await getPresignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    });

    return {
      uploadUrl,
      publicUrl: `${publicUrl}/${fileName}`,
    };
  } catch (error) {
    console.error("R2 presigned URL error:", error);
    throw new Error("Failed to generate upload URL");
  }
}

/**
 * Delete a file from R2 storage
 * @param fileName - Name/path of the file to delete
 */
export async function deleteFile(fileName: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("R2 delete error:", error);
    throw new Error("Failed to delete file from storage");
  }
}

/**
 * Generate a presigned URL for downloading/viewing a file
 * @param fileName - Name/path of the file
 * @returns Presigned URL valid for 1 hour
 */
export async function getSignedDownloadUrl(fileName: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    return await getPresignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });
  } catch (error) {
    console.error("R2 download URL error:", error);
    throw new Error("Failed to generate download URL");
  }
}
