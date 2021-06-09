const { transport, makeANiceEmail, body2TextStyle } = require("../mail");

const _leaseLink = (leaseId, baseLink) =>
  `<a href="${process.env.FRONTEND_URL}/${baseLink}/leases/${leaseId}">Go To the Lease</a>`;

const newLeaseLesseeEmail = async function({
  toEmail,
  lease,
  payment,
  ctx,
  type,
  user,
}) {
  const leaseLink = _leaseLink(lease.id, "tenant");
  transport.sendMail({
    // from: process.env.MAIL_USER,
    from: {
      name: "ReHouser Lease Offer",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `New Lease: ${lease.id} Signage Required`,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>Congratulations you have been offered a new lease. Follow the link to accept the lease!</p>
<p ${body2TextStyle}>${leaseLink}</p>
<p ${body2TextStyle}>All Lessees and Lessors must sign the lease and then it must be finalised by a Lessor to go into effect.</p>
<p ${body2TextStyle}>If something changes on the lease like the rent, everyone will become unsigned if the lease has not been finalised.</p>
      `,
      user,
      { adminSignature: true }
    ),
  });
};
const newLeaseLessorEmail = async function({
  toEmail,
  lease,
  payment,
  ctx,
  type,
  user,
}) {
  const leaseLink = _leaseLink(lease.id, "landlord");
  return transport.sendMail({
    from: {
      name: "Sign ReHouser Lease",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `A ReHouser lease requires your signature for ${lease.id} `,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>The application for your property has been accepted!</p>
<p ${body2TextStyle}>As a Lessor you need to head on over to the lease to sign it</p>
<p ${body2TextStyle}>${leaseLink}</p>
<p ${body2TextStyle}>Once all the Lessees and Lessors for the lease have signed the lease, A Lessor must click the "FINALISE" lease button found at the top of the Lease Signage area</p>
      `,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = {
  newLeaseLesseeEmail,
  newLeaseLessorEmail,
};
