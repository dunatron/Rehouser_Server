const { transport, makeANiceEmail, body2TextStyle } = require("../mail");

const offerRentalAppraisalEmail = async function({
  toEmail,
  appraisal,
  ctx,
  user,
}) {
  const {
    id,
    requestedBy: { email, firstName },
    location,
    rooms,
    bathrooms,
    heatSources,
    rent,
    rentValueAccepted,
  } = appraisal;

  const addPropertyLink = `process.env.FRONTEND_URL}/landlord/properties/add?appraisal_id=${appraisal.id}`;

  return transport.sendMail({
    // from: process.env.MAIL_USER,
    from: {
      name: "ReHouser Property Appraised",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `Property has been appraised for ${location}`,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>
    Thank you for giving us the opportunity to provide you with a professional rental appraisal for your property.
</p>
<p ${body2TextStyle}>
  After considering your property and the current rental market conditions we would be able to secure a weekly
  rent of $${rent}. This amount has been based on similar properties within the vicinity of your property.
</p>
<p ${body2TextStyle}>
  We would be grateful for the opportunity to Let and Manage your property with support of our platform. You can begin adding this property to the platform by clicking the below link
</p>
<p ${body2TextStyle}><a href="${addPropertyLink}">add property to platform</a></p>
<p ${body2TextStyle}>
  You can review our terms and conditions here at the landlord portal.
</p>
<p ${body2TextStyle}><a href="${process.env.FRONTEND_URL}/landlord/terms-of-engagement">Landlord Portal Terms of engagement</a><p>
<p ${body2TextStyle}>
  If you have any questions do not hesitate to give me a call.
</p>
`,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = offerRentalAppraisalEmail;
