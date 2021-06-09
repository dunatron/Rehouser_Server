const { transport, makeANiceEmail, body2TextStyle } = require("../mail");

const unsuccessfulRentalApplicationEmail = async function({
  toEmail,
  user,
  property,
}) {
  return transport.sendMail({
    // from: process.env.MAIL_USER,
    from: {
      name: "ReHouser Unsuccessful Rental Application",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `Unsuccessful rental application ${property.location} `,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>
  Your application for ${property.location} is now going to be permanently closed. If you made it to the lease stage you will also get an email informing you if you were successful or not.
</p>
  \n\n`,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = unsuccessfulRentalApplicationEmail;
