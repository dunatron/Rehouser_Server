const { transport, makeANiceEmail, body2TextStyle } = require("../mail");

const signupEmail = async function({ toEmail, ctx, user, confirmEmailToken }) {
  const confirmEmailLink = `${process.env.FRONTEND_URL}/account/${toEmail}/confirm/${confirmEmailToken}`;
  return transport.sendMail({
    // from: process.env.MAIL_USER,
    from: {
      name: "ReHouser User Signup",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `Welcome to ReHouser`,
    html: makeANiceEmail(
      `
<div>
  <p ${body2TextStyle}>Thank you for signing up to our platform.</p>
  <p ${body2TextStyle}>Please click on the below link which will confirm your email address.</p>
  <p ${body2TextStyle}><a href="${confirmEmailLink}">Click here to confirm your ReHouser account</a></p>
</div>
<div>
  <p ${body2TextStyle}>Alternatively you can copy paste the token <span>${confirmEmailToken}</span><p>
</div>
  \n\n`,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = signupEmail;
