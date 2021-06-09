const nodemailer = require("nodemailer");
const moment = require("moment");
const { CEO_DETAILS } = require("../const");
const cto_signature = require("../lib/emails/templates/cto_signature");

const primaryColor = "#0276e8";
const textColor = "#3e3e3e";
const body1TextStyle = `color="${textColor}" font-size="medium" style="margin: 0px 0px 16px 0px; color: ${textColor}; font-size: 16px; line-height: 22px;"`;
const body2TextStyle = `color="${textColor}" font-size="medium" style="margin: 0px 0px 16px 0px; color: ${textColor}; font-size: 14px; line-height: 22px;"`;
const subTextStyle = `color="${textColor}" font-size="small" style="font-size: 12px; line-height: 18px; color: ${textColor};"`;

// https://my.sendinblue.com/users/settings
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_LOGIN,
    pass: process.env.MAIL_PASS,
  },
  debug: false,
  logger: false,
});

const makeANiceEmail = (text, user, { adminSignature = true }) => {
  var today = moment().format("dddd, MMMM Do YYYY");

  var hasName = user.firstName || user.lastName;

  var dearUserSection = hasName
    ? `<div  style="margin-bottom: 16px;">
        <p ${body1TextStyle}>To ${user && user.firstName} ${user &&
        user.lastName}</p>
      </div>`
    : "";

  const signature = adminSignature ? cto_signature : "";

  return `
  <div className="email" style="
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 16px;
    max-width: 640px;
    color: ${textColor};
  ">
  <div style="height: 80px; text-align: center;"><img src="https://drive.google.com/uc?id=1AQPW9l1QSw-6N3c_DzLj_ETzD_vHMYaV" style="" role="presentation" height="80" margin: 0 auto; display: block;"></div>
  <!-- heading -->
  <h2 style="color: ${textColor}; border-bottom: 3px solid ${primaryColor}; font-size: 26px; text-align: center;">ReHouser Property Management Ltd</h2>
    <!-- address details -->
    <div>
      <div ${subTextStyle}>ReHouser</div>
      <div ${subTextStyle}>${CEO_DETAILS.phone}</div>
      <div ${subTextStyle}>${CEO_DETAILS.email}</div>
    </div>
    <!-- date -->
    <p ${subTextStyle}>${today}</p>
    <!-- dear -->
    ${dearUserSection}
    <!-- content/text -->
    ${text}
    <!-- regards -->
    <div style="margin-top: 32px; line-height: 22px;">
      <div style="margin-bottom: 32px;">
         <p ${body1TextStyle}>With Kind Regards,</p>
      </div>
      ${signature}
    </div>
  </div>
  `;
};

exports.transport = transport;
exports.makeANiceEmail = makeANiceEmail;

// text styles
exports.primaryColor = primaryColor;
exports.body1TextStyle = body1TextStyle;
exports.body2TextStyle = body2TextStyle;
exports.subTextStyle = subTextStyle;
