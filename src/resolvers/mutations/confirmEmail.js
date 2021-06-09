const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../../lib/mail");
const congratulateEmailConfirmEmail = require("../../lib/emails/congratulateEmailConfirmEmail");
const createChat = require("./createChat");
const { CEO_DETAILS, CTO_DETAILS, rehouserCookieOpt } = require("../../const");
const bcrypt = require("bcryptjs");
const { createTokens } = require("../../auth");
// const logUser = require("../../lib/logUser");

/**
 *
 * 1. accept tolen & EMAIL from mutation
 * 2. validate it etc and assign validated
 * 3. remember on client to accept a pub when opn login page for a confirm emailAddress
 *
 *
 * @param {*} parent
 * @param {*} args
 * @param {*} ctx
 * @param {*} info
 */
async function confirmEmail(parent, args, ctx, info) {
  const loggedInUserId = ctx.request.userId; // use this to autologin later

  // get the user we are trying to validate
  const userToValidate = await ctx.db.query.user(
    {
      where: {
        email: args.email,
      },
    },
    `{ id email emailValidated password permissions firstName lastName phone }`
  );
  console.log("User to validate right here => ", userToValidate);
  if (!userToValidate) {
    throw new Error(`No user found for ${args.email}`);
  }

  if (userToValidate.emailValidated === true) {
    throw new Error(`email has already been validated for ${args.email}`);
  }

  // if we cant find a user with these params token is invalid or expired
  const [user] = await ctx.db.query.users(
    {
      where: {
        email: args.email,
        confirmEmailToken: args.token,
        confirmEmailTokenExpiry_gte: Date.now() - 3600000,
      },
    },
    info
  );

  if (!user) {
    throw new Error("This token is either invalid or expired!");
  }

  if (userToValidate.email !== user.email) {
    throw new Error(
      `For security reason we could not validate this token against ${args.email} try requesting another token`
    );
  }

  if (!user.email) {
    throw new Error(
      "This user has no email to validate. This is strange behaviour. Please contact support!"
    );
  }

  // now that we have validated credentials we if we have no ctx.userId we assume they are not logged in so we do that
  if (!loggedInUserId) {
    const { token } = await createTokens(
      userToValidate,
      userToValidate.password
    );

    const cookieOptions = rehouserCookieOpt();
    ctx.response.cookie("token", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
  }

  // if (user.emailValidated) {
  //   throw new Error("You have already validated this emails account");
  // }

  // confirm the token is leget
  // make mutation to say
  // SHould Log the user in
  const updatedUserRes = await ctx.db.mutation.updateUser(
    {
      where: { email: user.email },
      data: {
        emailValidated: true,
        confirmEmailToken: null,
        confirmEmailTokenExpiry: null,
      },
    },
    info
  );
  // 3. Email them congratulations on confirming email

  congratulateEmailConfirmEmail({
    email: user.email,
    user: user,
  });

  //create a chat betwen user and admin
  if (user.email !== "admin@rehouser.co.nz") {
    const theChat = await createChat(
      parent,
      {
        data: {
          type: "PEER",
          name: `${CEO_DETAILS.firstname}${" "}${CEO_DETAILS.lastname} (Admin)`,
          participants: {
            connect: [
              {
                id: user.id,
              },
              {
                id: CEO_DETAILS.id,
              },
            ],
          },
          messages: {
            create: [
              {
                isMine: false,
                content: `Welcome to ReHouser ${user.firstName}, if you have any questions do not hesitate to drop me a message`,
                sender: {
                  connect: {
                    id: CEO_DETAILS.id,
                  },
                },
              },
              {
                isMine: false,
                content: `You can also call or text me on ${CEO_DETAILS.phone}`,
                sender: {
                  connect: {
                    id: CEO_DETAILS.id,
                  },
                },
              },
              {
                isMine: false,
                content: `Or email me at ${CEO_DETAILS.email}`,
                sender: {
                  connect: {
                    id: CEO_DETAILS.id,
                  },
                },
              },
            ],
          },
        },
      },
      ctx,
      info
    );
  }

  // 4. Return the message
  return updatedUserRes;
}

module.exports = confirmEmail;
