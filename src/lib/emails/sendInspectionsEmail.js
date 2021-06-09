const {
  body1TextStyle,
  body2TextStyle,
  subTextStyle,
  primaryColor,
} = require("../mail");
const emailCEO = require("./emailCEO");
const moment = require("moment");

const sendInspectionsEmail = (subject, inspections) => {
  const body = inspections.reduce((acc, inspection) => {
    const date = moment(inspection.date).format(
      "dddd, MMMM Do YYYY, h:mm:ss a"
    );
    return (
      acc +
      `<div style="border: 1px solid ${primaryColor}; padding: 8px; margin-bottom: 4px;">
                <div>
                  <div ${subTextStyle}>Id: ${inspection.id}</div>
                  <div ${subTextStyle}>property: ${inspection.property.location}</div>
                  <div ${subTextStyle}>date: ${date}
                  </div>
                </div>
              </div>`
    );
  }, `<div><p ${body1TextStyle}>Inspections List (${inspections.length})</p></div>`);
  emailCEO({
    ctx: null,
    subject: subject,
    from: {
      name: "ReHouser Inspections",
      address: process.env.MAIL_USER,
    },
    body: body,
  });
};

module.exports = sendInspectionsEmail;
