const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../config/aws");

/**
 * Generates a temporary signed URL
 */
exports.generateSignedUrl = async (fileName, fileType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${Date.now()}-${fileName}`,
    ContentType: fileType,
  });

  return await getSignedUrl(s3, command, { expiresIn: 300 });
};
