import 'server-only';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 environment variables are not configured.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

const BUCKET = process.env.R2_BUCKET_NAME ?? 'sterling-assets';

// Generate a presigned URL that allows the browser to upload ONE file
// directly to R2 within a limited time window. The secret key never
// leaves the server.
export async function createPresignedUploadUrl({
  key,
  contentType,
  contentLength,
  expiresIn = 300, // 5 minutes
}: {
  key: string;
  contentType: string;
  contentLength: number;
  expiresIn?: number;
}): Promise<string> {
  const client = getR2Client();

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: contentLength,
  });

  return getSignedUrl(client, command, { expiresIn });
}


// Generate a presigned URL that allows viewing a private file for a
// limited time. The bucket stays completely private — no public access.
// Admins get a fresh URL each time they load a review page.
export async function createPresignedGetUrl({
  key,
  expiresIn = 3600, // 1 hour — enough for an admin review session
}: {
  key: string;
  expiresIn?: number;
}): Promise<string> {
  const client = getR2Client();

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
}
