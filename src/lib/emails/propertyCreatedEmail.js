const { transport, makeANiceEmail, body2TextStyle } = require("../mail");

const propertyCreatedEmail = async function({ toEmail, appraisal, ctx, user }) {
  return transport.sendMail({
    from: {
      name: "ReHouser Property Created",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `A new Property has been added`,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>
    A new property has been created on the ReHouser platform
</p>
`,
      user,
      { adminSignature: false }
    ),
  });
};

module.exports = propertyCreatedEmail;
