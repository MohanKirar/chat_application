const { generateSignedUrl } = require("../utils/s3SignedUrl");

/**
 * Endpoint to get signed URL for upload
 */
exports.getSignedUrl = async (req, res) => {
  const { fileName, fileType } = req.body;

  const signedUrl = await generateSignedUrl(fileName, fileType);

  res.json({ signedUrl });
};
