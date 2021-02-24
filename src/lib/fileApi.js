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
  api_secret: process.env.CLOUDINARY_API_SECRET
};

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

exports.processUpload = async ({ upload, ctx, info, data = {} }) => {
  const { createReadStream, filename, mimetype, encoding } = await upload;

  const stream = createReadStream();

  cloudinary.config(cloudinaryConfObj);
  let resultObj = {};

  // const cloudinaryUpload = async ({ stream }) => {
  //   try {
  //     await new Promise((resolve, reject) => {
  //       // const streamLoad = cloudinary.uploader.upload_stream(
  //       //   {
  //       //     type: data.type ? data.type : "upload"
  //       //     // access_mode: data.access_mode ? data.access_mode : "authenticated",
  //       //     // ...data,
  //       //     // folder: `${process.env.STAGE}/${data.folder}`,
  //       //   },
  //       //   function(error, result) {
  //       //     if (result) {
  //       //       logger.log("info", `FILE UPLOAD SUCCESS`, {
  //       //         result: result
  //       //       });
  //       //       resultObj = {
  //       //         ...result
  //       //       };
  //       //       resolve();
  //       //     } else {
  //       //       // logger.log("error", `file APi reject err: `, {
  //       //       //   message: error
  //       //       // });
  //       //       logger.log("info", `Debug: fileApi`, {
  //       //         tron: "error in the resolve for file",
  //       //         error: error
  //       //       });
  //       //       reject(error);
  //       //       throw new Error(`cloudinary.uploader.upload_stream error`);
  //       //     }
  //       //   }
  //       // );
  //       // stream.pipe(streamLoad);
  //       var upload_stream = cloudinary.uploader.upload_stream(
  //         { tags: "basic_sample" },
  //         function(err, image) {
  //           if (err) {
  //             reject(err);
  //           }
  //           resultObj = {
  //             ...image,
  //           };
  //           resolve();
  //         }
  //       );
  //       // fs.createReadStream("./src/pizza.jpg").pipe(upload_stream);
  //       stream.pipe(upload_stream);
  //     });
  //   } catch (err) {
  //     logger.log("info", `File Upload Error`, {
  //       message: err.message,
  //     });
  //     throw new Error(`caught error uploading to cloudinry`);
  //   }
  // };

  // await cloudinaryUpload({ stream });

  // prove the stream can write to  file system

  const cloudinaryUpload = async ({ path }) => {
    try {
      await new Promise((resolve, reject) => {
        var upload_stream = cloudinary.uploader.upload_stream(
          { tags: "basic_sample" },
          function(err, image) {
            if (err) {
              reject(err);
            }
            resultObj = {
              ...image
            };
            resolve();
          }
        );
        // fs.createReadStream(path).pipe(upload_stream);
        stream.pipe(upload_stream);
      });
    } catch (err) {
      logger.log("info", `File Upload Error`, {
        message: err.message
      });
      throw new Error(`caught error uploading to cloudinry`);
    }
  };
  // const { id, path } = await storeUpload({ stream, filename });

  await cloudinaryUpload({ path });

  // Sync with Prisma
  const combinedFileData = {
    filename,
    mimetype,
    encoding,
    ...resultObj
  };

  // return file;
  const file = await ctx.db.mutation.createFile(
    {
      data: {
        ...combinedFileData,
        uploaderId: ctx.request.userId
      }
    },
    info
  );

  // const file = await ctx.db.mutation.createFile(
  //   {
  //     data: {
  //       filename,
  //       mimetype,
  //       encoding
  //     }
  //   },
  //   info
  // );

  return file;
};

exports.deleteFile = async ({ url, id, ctx }) => {
  try {
    cloudinary.config(cloudinaryConfObj);
    const cloudinaryFileKey = extractFileKey(url);
    await cloudinary.uploader.destroy(
      cloudinaryFileKey,
      { invalidate: true },
      async function(error, result) {
        if (result.result === "ok") {
          const where = { id: id };
          // return await ctx.db.mutation.deleteFile({ where }, `{ id }`);
        }
      }
    );
  } catch (err) {}
};
