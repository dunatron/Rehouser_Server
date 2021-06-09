const { transport, makeANiceEmail } = require("../mail");
const { CEO_DETAILS } = require("../../const");

// ToDo: note rest operator propably wont work like that here
const emailCEO = async function({ ctx, subject, body, from, ...rest }) {
  return transport.sendMail({
    // from: process.env.MAIL_USER,
    // ToDo: emailCeo should be able to recieve the from. that way we can customize its from name
    from: from
      ? from
      : {
          name: "ReHouser CEO Email",
          address: process.env.MAIL_USER,
        },
    to: CEO_DETAILS.email,
    subject: subject,
    ...rest,
    html: makeANiceEmail(
      body,
      {
        firstName: CEO_DETAILS.firstname,
        lastName: CEO_DETAILS.lastname,
      },
      { adminSignature: false }
    ),
  });
};

module.exports = emailCEO;
