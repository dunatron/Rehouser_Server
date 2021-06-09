const { transport, makeANiceEmail, body2TextStyle } = require("../mail");
const { CEO_DETAILS } = require("../../const");

const congratulateEmailConfirmEmail = async function({ email, user }) {
  return transport.sendMail({
    // from: process.env.MAIL_USER,
    from: {
      name: "ReHouser Account Validated",
      address: process.env.MAIL_USER,
    },
    to: email,
    subject: "ReHouser account validated",
    html: makeANiceEmail(
      `<p ${body2TextStyle}>Congratulations on validating your email! You are now able to use the platform.</p>
        \n\n`,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = congratulateEmailConfirmEmail;
