const { JWT_TOKEN_MAX_AGE, rehouserCookieOpt } = require("../../const");

function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function signout(parent, args, ctx, info) {
  const cookieOptions = rehouserCookieOpt();
  ctx.response.clearCookie("token", {
    ...cookieOptions,
  });
  ctx.response.clearCookie("reAuthed", {
    ...cookieOptions,
    httpOnly: false,
  });
  // ctx.response.clearCookie("refresh-token", {
  //   ...cookieOptions
  // });

  // ctx.response.clearCookie("token");

  // ctx.response.clearCookie("token", {
  //   domain: ".rehouser.co.nz",
  // });

  // await wait(5000);

  return { message: "Goodbye!" };
}

module.exports = signout;
