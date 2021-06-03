const cloudinary = require("cloudinary").v2;
const { extractFileKey } = require("./extractFileKey");
const { _isAdmin } = require("./permissionsCheck");

const logger = require("../middleware/loggers/logger");
var fs = require("fs");
// import { createWriteStream } from 'fs'

//https://cloudinary.com/documentation/image_upload_api_reference#required_parameters

const cloudinaryConfObj = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryConfObj);

exports._isUploader = ({ file, ctx }) => {
  return file.uploaderId === ctx.request.userId;
};

exports._isUploaderOrAdmin = ({ file, ctx }) => {
  if (!ctx.request) return false; // this is for subs...
  if (file.uploaderId === ctx.request.userId || _isAdmin(ctx)) {
    return true;
  }
  return false;
};

const uploadDir = "./uploads";
const storeUpload = async ({ stream, filename }) => {
  const id = "tro";
  const path = `${uploadDir}/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(path))
      .on("finish", () => resolve({ path }))
      .on("error", reject)
  );
};

// the idea is that all prod files are the root. uat and prod share the same account for now
const makeFolder = (folder) => {
  if (process.env.STAGE === "prod") return folder;
  return `${process.env.STAGE}/${folder}`;
};

const cloudinaryUploadStream = async ({ stream, data }) =>
  new Promise((resolve, reject) => {
    const streamLoad = cloudinary.uploader.upload_stream(
      {
        type: data.type ? data.type : "upload",
        access_mode: data.access_mode ? data.access_mode : "authenticated",
        ...data,
        // folder: `${process.env.STAGE}/${data.folder}`,
        folder: makeFolder(data.folder),
      },
      function(error, result) {
        if (result) {
          resolve(result);
        } else {
          logger.log("Cloudinary file upload error", `cloudinaryUploadStream`, {
            error: error,
          });
          reject(error);
          throw new Error(`cloudinary.uploader.upload_stream error`);
        }
      }
    );
    stream.pipe(streamLoad);
  });

exports.processUpload = async ({ upload, ctx, info, data = {} }) => {
  const { createReadStream, filename, mimetype, encoding } = await upload;
  const stream = createReadStream();

  const cloudinaryFile = await cloudinaryUploadStream({ stream, data });

  // Make sure to explicitly add the keys
  const combinedFileData = {
    filename, // '000_1a03sb.83d8b095222.original.jpg'
    mimetype, // 'image/jpeg'
    encoding, // '7bit'
    asset_id: cloudinaryFile.asset_id, // 'ee66c6d4639bd5a6a123ff81cbfb930e'
    public_id: cloudinaryFile.public_id, // 'dev/properties/ChIJa4WaRxNJDW0RrOL-WZvO60A/images/f1tbkbjakeqd8cb1oymr'
    version: cloudinaryFile.version, // 1622712954
    version_id: cloudinaryFile.version_id, // '5e431562ca1fec7b32bebee455fb7fcb'
    signature: cloudinaryFile.signature, // '865862eb44424b33aaa595bc00568f86225074cb'
    width: cloudinaryFile.width, // 2886
    height: cloudinaryFile.height, // 1924
    format: cloudinaryFile.format, // 'jpg'
    resource_type: cloudinaryFile.resource_type, // 'image'
    created_at: cloudinaryFile.created_at, // '2021-06-03T09:35:54Z'
    tags: cloudinaryFile.tags, // []
    bytes: cloudinaryFile.bytes, // 845706
    type: cloudinaryFile.type, // 'upload'
    etag: cloudinaryFile.etag, // '1720a1c2db69a4fd28214e556eff3a79'
    placeholder: cloudinaryFile.placeholder, // false
    url: cloudinaryFile.secure_url, // making url secure_url => 'http://res.cloudinary.com/dkhe0hx1r/image/upload/v1622712954/dev/properties/ChIJa4WaRxNJDW0RrOL-WZvO60A/images/f1tbkbjakeqd8cb1oymr.jpg'
    secure_url: cloudinaryFile.secure_url, // 'https://res.cloudinary.com/dkhe0hx1r/image/upload/v1622712954/dev/properties/ChIJa4WaRxNJDW0RrOL-WZvO60A/images/f1tbkbjakeqd8cb1oymr.jpg'
    access_mode: cloudinaryFile.access_mode, // 'public'
    original_filename: cloudinaryFile.original_filename, // 'file'
    // api_key: cloudinaryFile.asset_id, // why i am explicitly adding as i don't want this, could delete it but would rather add
    // ...cloudinaryFile,
  };

  // upload cloudinary result object to the database
  const file = await ctx.db.mutation.createFile(
    {
      data: {
        ...combinedFileData,
        uploaderId: ctx.request.userId,
      },
    },
    info
  );

  return file;
};

exports.deleteFile = async ({ url, id, ctx }) => {
  const where = { id: id };
  try {
    cloudinary.config(cloudinaryConfObj);
    const cloudinaryFileKey = extractFileKey(url);
    await cloudinary.uploader.destroy(
      cloudinaryFileKey,
      { invalidate: true },
      async function(error, result) {
        if (result.result === "ok") {
          return await ctx.db.mutation.deleteFile({ where }, `{ id }`);
        }
        if (error) {
          throw new Error(`Error deleting file from storage provider`);
        }
      }
    );
  } catch (err) {}
};
