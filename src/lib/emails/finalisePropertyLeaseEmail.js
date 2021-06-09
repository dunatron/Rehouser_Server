const { transport, makeANiceEmail, body2TextStyle } = require("../mail");

const finalisePropertyLeaseEmail = async function({
  baseLink,
  toEmail,
  lease,
  // payment,
  wallet,
  ctx,
  user,
}) {
  return transport.sendMail({
    // from: process.env.MAIL_USER,
    from: {
      name: "ReHouser Lease Finalised",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `Lease Accepted and Signed: ${lease.property.location}`,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>Congratulations the lease for ${lease.property.location} has now been signed and is in full effect!</p>
<p ${body2TextStyle}>The Lease wallet has ($${wallet.amount}) which includes a weekly rent charge and the bond charge.</p>
<p ${body2TextStyle}>Head on over to the lease to view and manage ${process.env.EMAIL_PREFIX}/${baseLink}/leases/${lease.id}</p>
    `,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = finalisePropertyLeaseEmail;
