const { transport, makeANiceEmail, body2TextStyle } = require("../mail");

const updatePropertyLeaseEmail = async function({
  baseLink,
  toEmail,
  lease,
  ctx,
  user,
}) {
  const leaseLink = `${process.env.FRONTEND_URL}/${baseLink}/leases/${lease.id}`;
  return transport.sendMail({
    // from: process.env.MAIL_USER,
    from: {
      name: "ReHouser Lease Change",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `Lease updated and unsigned: ${lease.id}`,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>The lease has been updated and all parties have been un-signed Please head to the lease and review it and sign!</p>
<p ${body2TextStyle}>You can review the updated lease at ${leaseLink}</p>
`,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = updatePropertyLeaseEmail;
