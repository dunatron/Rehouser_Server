const rentalApplicationsConnection = require("./connections/rentalApplicationsConnection");
const chatsConnection = require("./connections/chatsConnection");
const messagesConnection = require("./connections/messagesConnection");
const paymentsConnection = require("./connections/paymentsConnection");
const chargesConnection = require("./connections/chargesConnection");
const rentalAppraisalsConnection = require("./connections/rentalAppraisalsConnection");
const propertiesConnection = require("./connections/propertiesConnection");
const inspectionsConnection = require("./connections/inspectionsConnection");
const propertyLeasesConnection = require("./connections/propertyLeasesConnection");
const contactSubmissionsConnection = require("./connections/contactSubmissionsConnection");
const foreignLinksConnection = require("./connections/foreignLinksConnections");
const filesConnection = require("./connections/filesConnection");
const bankAccountsConnection = require("./connections/bankAccountsConnection");
const bankTransactionConnection = require("./connections/bankTransactionConnection");

const Connection = {
  rentalApplicationsConnection,
  chatsConnection,
  messagesConnection,
  paymentsConnection,
  chargesConnection,
  rentalAppraisalsConnection,
  propertiesConnection,
  inspectionsConnection,
  propertyLeasesConnection,
  contactSubmissionsConnection,
  foreignLinksConnection,
  filesConnection,
  bankAccountsConnection,
  bankTransactionConnection,
};

module.exports = Connection;
