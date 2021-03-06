// require("dotenv").config({ path: "./variables-prod.env" })
require("dotenv").config({ path: "./variables.env" });
// require("dotenv").config()
// All about how to deal with chromes new cookie laws https://blog.heroku.com/chrome-changes-samesite-cookie
const cookieParser = require("cookie-parser");
const createServer = require("./createServer");
const initialiseTasks = require("./lib/tasks/index");
const server = createServer();
const stripeMiddleWare = require("./middleware/stripe/index");
const userMiddleware = require("./middleware/user/index");
const routes = require("./routes/index");
const logger = require("./middleware/loggers/logger");

const db = require("./db");

const jwt = require("jsonwebtoken");

process.on("uncaughtException", (err) => {
  logger.log("error", `Uncaught Exception: ${err.message}`, {
    message: err.message,
  });
  return err;
});

process.on("unhandledRejection", (reason, promise) => {
  logger.log("error", `unhandledRejection`, {
    reason: reason,
  });
  return reason; // return the errors to try not crash express
});

// sets up pasrsing the body of the request
stripeMiddleWare(server);

const expressLogger = function(req, res, next) {
  var ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  var ipAddr = req.headers["x-forwarded-for"];
  if (ipAddr) {
    var list = ipAddr.split(",");
    ipAddr = list[list.length - 1];
  } else {
    ipAddr = req.connection.remoteAddress;
  }
  logger.log("info", `request to express server ${req.body.operationName}`, {
    ip: ip,
    ipAddr: ipAddr,
    url: req.url,
    user: {
      id: req.userId,
      permissions: req.userPermissions,
    },
    method: req.method,
    operationName: req.body.operationName,
    variables: req.body.variables,
    headers: req.headers,
    userAgent: req.headers["user-agent"],
    // query: req.body.query
  });

  next();
};

server.use(expressLogger);
server.express.use(cookieParser());

const expressErrorMiddleware = async (err, req, res, next) => {
  logger.log("error", `expressErrorMiddleware`, {
    err: err,
    req: req,
    res: res,
  });
  next();
};

server.express.use(expressErrorMiddleware);
// userMiddleware(server);
// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId, userPermissions, userEmail } = jwt.verify(
      token,
      process.env.APP_SECRET
    );
    // attach the id and permissions to the request
    req.userId = userId;
    req.userPermissions = userPermissions;
    req.userEmail = userEmail;
  }
  next();
});

// 2. Create a middleware that populates the user on each request

server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    "{ id, permissions, email }"
  );
  req.user = user;
  next();
});

routes(server);

// setup cron jobs
initialiseTasks();

const allowedClientOrigins = [
  "http://localhost:7777",
  "http://localhost:3000",
  "https://rehouser-next-prod.herokuapp.com",
  "http://app.rehouser.co.nz",
  "http://rehouser.co.nz",
  "https://app.rehouser.co.nz",
  "https://rehouser.co.nz",
  "https://yoga.rehouser.co.nz",
  "http://app.uat.rehouser.co.nz",
  process.env.FRONTEND_URL,
];

const Mib = 1048576;

// Start gql yoga/express server
const app = server.start(
  {
    port: process.env.PORT || 4444,
    cors: {
      credentials: true,
      origin: allowedClientOrigins,
    },
    uploads: {
      maxFieldSize: 1000000, // Maximum allowed non-file multipart form field size in bytes; enough for your queries.
      maxFileSize: Mib * 2, // Maximum allowed file size in bytes.
      maxFiles: 5, // Maximum allowed number of files.
    },
    debug: true,
    playground: "/playground",
    // https://github.com/apollographql/subscriptions-transport-ws/issues/450
    subscriptions: {
      path: "/",
      onConnect: (connectionParams, webSocket, context) => {
        const { isLegacy, socket, request } = context;
        webSocket.on("error", (error) => {
          logger.log("error", `potential ws err onConnect`, {
            error: error,
          });
        });
        logger.log("info", `subscriptions on connect`, {
          connectionParams: connectionParams,
          headers: request.headers,
        });
      },
      onDisconnect: (webSocket, context) => {
        logger.log("info", `subscriptions on disconnect`, {
          context: context,
        });
        webSocket.on("error", (error) => {
          logger.log("error", `potential ws err onDisconnect`, {
            error: error,
          });
        });
      },
      keepAlive: 10000, // use 10000 like prisma or false
    },
  },
  (details) => {
    logger.info("gql yoga/express server is up", {
      ...details,
      port: details.port,
    });
  }
);

module.exports = app;
