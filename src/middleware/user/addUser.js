const jwt = require("jsonwebtoken");
const { refreshTokens } = require("../../auth");
const { JWT_TOKEN_MAX_AGE, rehouserCookieOpt } = require("../../const");
const db = require("../../db");

const addUser = async (req, res, next) => {
  let token = req.cookies.token;
  const cookieOptions = rehouserCookieOpt();

  // if (!token) {
  //   const header = req.headers["authorization"]; // hmm this might be blocking the cloudinary
  //   if (typeof header !== "undefined") {
  //     const bearer = header.split(" ");
  //     token = bearer[1];
  //   } else {
  //     return next();
  //   }
  // }

  if (!token) {
    return next();
  }
  try {
    // decode the id and permissions from the token request
    const { userId, userPermissions, userEmail } = jwt.verify(
      token,
      process.env.APP_SECRET
    );
    // attach the id and permissions to the request
    req.userId = userId;
    req.userPermissions = userPermissions;
    req.userEmail = userEmail;
  } catch (err) {
    const refreshToken = req.cookies["refresh-token"];
    if (!refreshToken) {
      return next();
    }

    const newTokens = await refreshTokens(refreshToken, db);
    // const cookieOptions = rehouserCookieOpt();
    if (newTokens.token && newTokens.refreshToken) {
      res.cookie("token", newTokens.token, {
        ...cookieOptions,
      });
      res.cookie("refresh-token", newTokens.refreshToken, {
        ...cookieOptions,
      });
    }
    req.userId = newTokens.user.id;
    req.userPermissions = newTokens.user.permissions;
    req.userEmail = newTokens.user.email;
  }
  return next();
};

module.exports = addUser;
