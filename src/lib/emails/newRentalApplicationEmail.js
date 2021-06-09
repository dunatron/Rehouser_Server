const { transport, makeANiceEmail, body2TextStyle } = require("../mail");

const newRentalApplicationEmail = async function({
  toEmail,
  rentalApplication,
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
      name: "ReHouser Rental Application",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `New Rental Application ID:${id}`,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>A new rental application has been created for: ${property.location}</p>
<p ${body2TextStyle}>You can complete the application at ${process.env.FRONTEND_URL}/tenant/applications/${id}</p>
<p ${body2TextStyle}>The specific property you have applied for can be found at ${process.env.FRONTEND_URL}/find/property/${property.id} </p>
<p ${body2TextStyle}>The visibility is currently set to ${visibility}</p>
<p ${body2TextStyle}>Good luck with your application</p>
`,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = newRentalApplicationEmail;
