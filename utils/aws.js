import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from '../config/server-config.js';

const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.ACCESS_KEY,
    secretAccessKey: config.SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (fileBuffer, fileName, contentType) => {
  const key = `${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: config.S3_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3.send(command);

  const fileUrl = `https://${config.S3_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${key}`;

  return { Location: fileUrl, Key: key, Bucket: config.S3_BUCKET_NAME };
};
