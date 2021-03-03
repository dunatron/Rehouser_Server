var crypto = require("crypto");
var moment = require("moment");

async function makeCoudinaryAccess(parent, args, ctx, info) {
  if (!ctx.request.userEmail) {
    return null;
  }
  //   var hash = crypto.createHash("sha256");
  // just use my email for the account?
  // they would just need to have filePermmisions or be a wizard I guess
  const cloudinary_name = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;
  const cloud_timestamp = moment().unix();
  const cloudinary_secret = process.env.CLOUDINARY_API_SECRET;
  const cloudinary_username = process.env.CLOUDINARY_USERNAME;

  const cloudParams = `cloud_name=${cloudinary_name}&timestamp=${cloud_timestamp}&username=${cloudinary_username}${cloudinary_secret}`;

  const signature = crypto
    .createHash("sha256")
    .update(cloudParams)
    .digest("hex");

  return {
    cloud_name: cloudinary_name,
    api_key: cloudinary_api_key,
    username: cloudinary_username,
    timestamp: cloud_timestamp,
    signature: signature,
  };
}

module.exports = makeCoudinaryAccess;
