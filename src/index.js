require("dotenv").config({ path: "./variables.env" });
const cookieParser = require("cookie-parser");
const createServer = require("./createServer");

const server = createServer();
const logger = require("./middleware/loggers/logger");

const clientOrigins = [
  "http://localhost:7777",
  "https://localhost:7777",
  "https://rehouser-next-prod.herokuapp.com",
  "http://app.rehouser.co.nz",
  "https://app.rehouser.co.nz",
  "http://rehouser.co.nz",
  "https://rehouser.co.nz",
  "http://app.uat.rehouser.co.nz",
  "https://app.uat.rehouser.co.nz"
];

server.express.use(cookieParser());

// Start gql yoga/express server
const app = server.start(
  {
    port: process.env.PORT || 4444,
    cors: {
      credentials: true,
      origin: clientOrigins
    },
    uploads: {
      maxFieldSize: 999999999,
      maxFileSize: 999999999,
      maxFiles: 5
    },
    debug: true,
    // playground: "/playground",
    // https://github.com/apollographql/subscriptions-transport-ws/issues/450
    subscriptions: {
      path: "/",
      keepAlive: 10000 // use 10000 like prisma or false
    }
  },
  details => {
    console.log("Server running on Port: ", details.port);
    console.log("Server Full Details: ", details);
  }
);

module.exports = app;
