const { transport, makeANiceEmail, body2TextStyle } = require("../mail");

const unsuccessfulLeaseEmail = async function({ toEmail, user, property }) {
  const propertySearchLink = `${process.env.FRONTEND_URL}/property-search`;
  return transport.sendMail({
    // from: process.env.MAIL_USER,
    from: {
      name: "ReHouser Unsuccessful Lease",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `Unsuccessful lease for ${property.location}`,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>
  Your lease has been unsuccessful for ${property.location}.
</p>
<p ${body2TextStyle}>
  Please check our <a href="${propertySearchLink}/property-search">Platform</a> for other available properties
</p>
`,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = unsuccessfulLeaseEmail;
