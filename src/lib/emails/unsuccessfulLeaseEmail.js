const { transport, makeANiceEmail } = require("../mail");

const unsuccessfulLeaseEmail = async function({ toEmail, user, property }) {
  return transport.sendMail({
    // from: process.env.MAIL_USER,
    from: {
      name: "Rehouser Unsuccessful Lease",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `Usuccessful Lease for ${property.location}`,
    html: makeANiceEmail(
      `
<div style="line-height: 18px;">
  Your lease has been unsuccessful for ${property.location}.
</div>
<div style="line-height: 18px; margin-top: 16px;">
  Please check our <a href="${process.env.FRONTEND_URL}/property-search">Platform</a> for other available properties
</div>
<div style="line-height: 18px; margin-top: 16px;">

</div>
<div style="line-height: 18px; margin-top: 16px;">

</div>
  \n\n`,
      user
    ),
  });
};

module.exports = unsuccessfulLeaseEmail;
