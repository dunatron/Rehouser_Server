const { transport, makeANiceEmail, body2TextStyle } = require("../mail");
const { CEO_DETAILS } = require("../../const");

const inviteUserToPlatformEmail = async function({
  email,
  user,
  invitor,
  subUrl,
  message,
}) {
  const inviterName = invitor ? invitor.firstName : "";
  const inviterLastName = invitor ? invitor.lastName : "";
  return transport.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    // subject: "Invitation to Rehouser",
    from: {
      name: "ReHouser Platform Invite",
      address: process.env.MAIL_USER,
    },
    subject: `${inviterName} ${" "} ${inviterLastName} has invited you to the ReHouser property platform`,
    html: makeANiceEmail(
      `
<p>${inviterName} ${" "} ${inviterLastName} has invited you to the ReHouser property platform!</p>
<p>
<a href="${
        process.env.FRONTEND_URL
      }${subUrl}?invite=1">They have invited you to this section</a>
</p>
<div style="line-height: 18px;">
  <p> ${message}</p>
</div>
`,
      user,
      { adminSignature: true }
    ),
  });
};

module.exports = inviteUserToPlatformEmail;
