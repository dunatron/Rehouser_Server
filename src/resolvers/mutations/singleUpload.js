const { processUpload, deleteFile } = require("../../lib/fileApi");

async function singleUpload(parent, { file, data }, ctx, info) {
  const uploadedFile = await processUpload({
    upload: file,
    ctx,
    info,
    data,
  });

  return uploadedFile;
}

module.exports = singleUpload;
