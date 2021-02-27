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
  // const id = shortid.generate()
  const id = "tro";
  const path = `${uploadDir}/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(path))
      .on("finish", () => resolve({ path }))
      .on("error", reject)
  );
};

// const cloudinaryUpload = async ({ stream, data }) => {
//   try {
//     await new Promise((resolve, reject) => {
//       const streamLoad = cloudinary.uploader.upload_stream(
//         {
//           type: data.type ? data.type : "upload",
//           access_mode: data.access_mode ? data.access_mode : "authenticated",
//           ...data,
//           folder: `${process.env.STAGE}/${data.folder}`,
//         },
//         function(error, result) {
//           if (result) {
//             logger.log("info", `FILE UPLOAD SUCCESS`, {
//               result: result,
//             });
//             resultObj = {
//               ...result,
//             };
//             resolve(result);
//           } else {
//             logger.log("info", `Debug: fileApi`, {
//               tron: "error in the resolve for file",
//               error: error,
//             });
//             reject(error);
//             throw new Error(`cloudinary.uploader.upload_stream error`);
//           }
//         }
//       );
//       stream.pipe(streamLoad);
//     });
//   } catch (err) {
//     logger.log("info", `File Upload Error`, {
//       message: err.message,
//     });
//     throw new Error(`caught error uploading to cloudinry`);
//   }
// };

// const cloudinaryUpload = async ({ stream, data }) => {
//   return new Promise((resolve, reject) => {
//     const streamLoad = cloudinary.uploader.upload_stream(
//       {
//         type: data.type ? data.type : "upload",
//         access_mode: data.access_mode ? data.access_mode : "authenticated",
//         ...data,
//         folder: `${process.env.STAGE}/${data.folder}`,
//       },
//       function(error, result) {
//         if (result) {
//           logger.log("info", `FILE UPLOAD SUCCESS`, {
//             result: result,
//           });
//           resultObj = {
//             ...result,
//           };
//           resolve(result);
//         } else {
//           logger.log("info", `Debug: fileApi`, {
//             tron: "error in the resolve for file",
//             error: error,
//           });
//           reject(error);
//           throw new Error(`cloudinary.uploader.upload_stream error`);
//         }
//       }
//     );
//     stream.pipe(streamLoad);
//   });
// };

const cloudinaryUploadStream = async ({ stream, data }) =>
  new Promise((resolve, reject) => {
    const streamLoad = cloudinary.uploader.upload_stream(
      {
        type: data.type ? data.type : "upload",
        access_mode: data.access_mode ? data.access_mode : "authenticated",
        ...data,
        folder: `${process.env.STAGE}/${data.folder}`,
      },
      function(error, result) {
        if (result) {
          resolve(result);
        } else {
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

  // combine cloudiary returned file data
  const combinedFileData = {
    filename,
    mimetype,
    encoding,
    ...cloudinaryFile,
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
