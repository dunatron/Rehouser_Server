const { transport, makeANiceEmail, body2TextStyle } = require("../mail");
const { CEO_DETAILS } = require("../../const");

const requestAppraisalEmail = async function({
  toEmail,
  user,
  location,
  appraisal,
}) {
  return transport.sendMail({
    // priority: "high",
    // from: process.env.MAIL_USER,
    from: {
      name: "ReHouser Appraisal Received",
      address: process.env.MAIL_USER,
    },
    to: toEmail,
    subject: `Appraisal received for ${location}`,
    html: makeANiceEmail(
      `
<p ${body2TextStyle}>
  Thank you for requesting a rental appraisal. We will be in contact shortly with an accurate assessment based on the information you have provided.
</p>

<p ${body2TextStyle}>
In the meantime if you have any questions please do not hesitate to contact me via email at ${CEO_DETAILS.email} or phone on  ${CEO_DETAILS.phone}.
</p>

<p ${body2TextStyle}>
We may need to visit the property to increase the accuracy of this. I will be in touch with you to discuss this further if necessary.
</p>

<p ${body2TextStyle}>
A list of your appraisals on the platform can be found at the below url:
</p>
<p ${body2TextStyle}><a href="${process.env.FRONTEND_URL}/landlord/appraisals">${process.env.FRONTEND_URL}/landlord/appraisals</a></p>
`,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = requestAppraisalEmail;
