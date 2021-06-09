const { transport, makeANiceEmail, body2TextStyle } = require("../mail");

const newRentalApplicationEmail = async function({
  toEmail,
  rentalApplication,
  applicantId,
  ctx,
  user,
}) {
  const {
    id,
    visibility,
    stage,
    finalised,
    owner,
    property,
    applicants,
  } = rentalApplication;

  return transport.sendMail({
    // from: process.env.MAIL_USER,
    from: {
      name: "ReHouser Application Applicant",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `New Applicant: ${applicantId} for RentalApplication`,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>A new Applicant has applied against your RentalApplication for Property: ${property.location}</p>
<p ${body2TextStyle}>You can approve them for your application at ${process.env.FRONTEND_URL}/tenant/applications/${id}</p>
<p ${body2TextStyle}>The application visibility is currently set to ${visibility}</p>
<p ${body2TextStyle}>Good luck with your application</p>
    `,
      user,
      { adminSignature: false }
    ),
  });
};

module.exports = newRentalApplicationEmail;
