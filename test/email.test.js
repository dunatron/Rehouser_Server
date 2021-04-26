/**
 * https://github.com/prisma-labs/graphql-yoga/issues/616
 * Note to run individual tests run "yarn run test -g 'signupEmail'"
 */
require("dotenv").config({ path: "./variables.env" });
const moment = require("moment");

const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const userList = require("../src/seeds/usersList");
const propertiesList = require("../src/seeds/propertiesList");

// emails
const congratulateEmailConfirmEmail = require("../src/lib/emails/congratulateEmailConfirmEmail"); // done
const emailCEO = require("../src/lib/emails/emailCEO"); // done
const finalisePropertyLeaseEmail = require("../src/lib/emails/finalisePropertyLeaseEmail"); // done
const inviteUserToPlatformEmail = require("../src/lib/emails/inviteUserToPlatformEmail"); // done
const {
  newLeaseLesseeEmail,
  newLeaseLessorEmail,
} = require("../src/lib/emails/newLeaseEmail"); // done
const newRentalApplicationEmail = require("../src/lib/emails/newRentalApplicationEmail"); // done
const newRentalGroupApplicantEmail = require("../src/lib/emails/newRentalGroupApplicantEmail"); // ToDo
const offerRentalAppraisalEmail = require("../src/lib/emails/offerRentalAppraisalEmail"); // ToDo
const propertyCreatedEmail = require("../src/lib/emails/propertyCreatedEmail"); // ToDo
const requestAppraisalEmail = require("../src/lib/emails/requestAppraisalEmail"); // ToDo
const sendInspectionsEmail = require("../src/lib/emails/sendInspectionsEmail"); // ToDo
const signupEmail = require("../src/lib/emails/signupEmail"); // done
const unsuccessfulLeaseEmail = require("../src/lib/emails/unsuccessfulLeaseEmail"); // ToDo
const unsuccessfulRentalApplicationEmail = require("../src/lib/emails/unsuccessfulRentalApplicationEmail"); // ToDo
const updatePropertyLeaseEmail = require("../src/lib/emails/updatePropertyLeaseEmail"); // ToDo

const rehouserCTO = userList[1];
const property1 = propertiesList[0];
const property2 = propertiesList[1];

const appraisal1 = {
  id: "fake-appraisal-id",
  requestedBy: rehouserCTO,
  location: property1.location,
  rooms: property1.rooms,
  bathrooms: property1.bathrooms,
  heatSources: property1.heatSources,
  rent: property1.rent,
  rentValueAccepted: false,
};

const lease1 = {
  id: "fake-lease-id",
  property: property1,
  wallet: {
    amount: 80000,
  },
  user: rehouserCTO,
};

const rentalApplication1 = {
  id: "fake-rental-applicatoin-id",
  visibility: "PRIVATE", // PRIVATE,FRIENDS_ONLY,PUBLIC
  stage: "INITIALIZING", // INITIALIZING, PENDING, SHORTLISTED, DENIED, ACCEPTED
  finalised: "",
  owner: rehouserCTO,
  property: property1,
  applicants: [],
};

const inspection1 = {
  id: "fake-inspection-id-1",
  property: property1,
  date: moment().format(), // 2021-04-21T00:51:50+12:00
};

const inspection2 = {
  id: "fake-inspection-id-2",
  property: property2,
  date: "2021-04-21T00:51:50+12:00",
};

/**
 * =====SINGLE COPY PASTE TESTS=======
 * congratulateEmailConfirmEmail: yarn run test -g 'congratulateEmailConfirmEmail'
 * emailCEO: yarn run test -g 'emailCEO'
 * finalisePropertyLeaseEmail: yarn run test -g 'finalisePropertyLeaseEmail'
 * inviteUserToPlatformEmail: yarn run test -g 'inviteUserToPlatformEmail'
 * newLeaseLesseeEmail: yarn run test -g 'newLeaseLesseeEmail'
 * newLeaseLessorEmail: yarn run test -g 'newLeaseLessorEmail'
 * newRentalApplicationEmail: yarn run test -g 'newRentalApplicationEmail'
 * newRentalGroupApplicantEmail: yarn run test -g 'newRentalGroupApplicantEmail'
 * offerRentalAppraisalEmail: yarn run test -g 'offerRentalAppraisalEmail'
 * propertyCreatedEmail: yarn run test -g 'propertyCreatedEmail'
 * requestAppraisalEmail: yarn run test -g 'requestAppraisalEmail'
 * sendInspectionsEmail: yarn run test -g 'sendInspectionsEmail'
 * signupEmail: yarn run test -g 'signupEmail'
 * unsuccessfulLeaseEmail: yarn run test -g 'unsuccessfulLeaseEmail'
 * unsuccessfulRentalApplicationEmail: yarn run test -g 'unsuccessfulRentalApplicationEmail'
 * updatePropertyLeaseEmail: yarn run test -g 'updatePropertyLeaseEmails'
 */

describe("Emails", function() {
  // congratulateEmailConfirmEmail
  describe("congratulateEmailConfirmEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await congratulateEmailConfirmEmail({
        email: rehouserCTO.email,
        user: rehouserCTO,
      });
    });
  });
  // Signup Email
  describe("signupEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await signupEmail({
        toEmail: rehouserCTO.email,
        ctx: null,
        user: rehouserCTO,
        confirmEmailToken: "",
      });
    });
  });
  // finalisePropertyLeaseEmail
  describe("finalisePropertyLeaseEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await finalisePropertyLeaseEmail({
        baseLink: "landlord",
        toEmail: rehouserCTO.email,
        lease: lease1,
        wallet: lease1.wallet,
        user: rehouserCTO,
      });
    });
  });

  // inviteUserToPlatformEmail
  describe("inviteUserToPlatformEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await inviteUserToPlatformEmail({
        email: rehouserCTO.email,
        user: rehouserCTO,
        invitor: rehouserCTO,
        subUrl: "/some-fake-url-squad-squad-squad-bench-them",
        message:
          "Hi this is a test you son of Bitch, bet you dont even read this. essentially we can use this email to send them to different places based on whats happening and a message too",
      });
    });
  });

  // newLeaseLesseeEmail
  describe("newLeaseLesseeEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await newLeaseLesseeEmail({
        toEmail: rehouserCTO.email,
        lease: lease1,
        user: rehouserCTO,
      });
    });
  });

  // newLeaseLessorEmail
  describe("newLeaseLessorEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await newLeaseLessorEmail({
        toEmail: rehouserCTO.email,
        lease: lease1,
        user: rehouserCTO,
      });
    });
  });

  // newRentalApplicationEmail
  describe("newRentalApplicationEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await newRentalApplicationEmail({
        toEmail: rehouserCTO.email,
        rentalApplication: rentalApplication1,
        user: rehouserCTO,
      });
    });
  });

  // newRentalGroupApplicantEmail
  describe("newRentalGroupApplicantEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await newRentalGroupApplicantEmail({
        toEmail: rehouserCTO.email,
        rentalApplication: rentalApplication1,
        applicantId: "fake-applicant-id",
        user: rehouserCTO,
      });
    });
  });

  // offerRentalAppraisalEmail
  describe("offerRentalAppraisalEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await offerRentalAppraisalEmail({
        toEmail: rehouserCTO.email,
        appraisal: appraisal1,
        user: rehouserCTO,
      });
    });
  });

  // propertyCreatedEmail
  describe("propertyCreatedEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await propertyCreatedEmail({
        toEmail: rehouserCTO.email,
        appraisal: appraisal1,
        user: rehouserCTO,
      });
    });
  });

  // requestAppraisalEmail
  describe("requestAppraisalEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await requestAppraisalEmail({
        toEmail: rehouserCTO.email,
        user: rehouserCTO,
        location: property1.location,
        appraisal: appraisal1,
      });
    });
  });

  // sendInspectionsEmail
  describe("sendInspectionsEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await sendInspectionsEmail(
        "The Inspections? I have left this uptot he functions for the subject for some reason",
        [inspection1, inspection2]
      );
    });
  });

  // unsuccessfulLeaseEmail
  describe("unsuccessfulLeaseEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await unsuccessfulLeaseEmail({
        toEmail: rehouserCTO.email,
        user: rehouserCTO,
        property: property1,
      });
    });
  });

  // unsuccessfulRentalApplicationEmail
  describe("unsuccessfulRentalApplicationEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await unsuccessfulRentalApplicationEmail({
        toEmail: rehouserCTO.email,
        user: rehouserCTO,
        property: property1,
      });
    });
  });

  // updatePropertyLeaseEmail
  describe("updatePropertyLeaseEmail", function() {
    it("should return maybe a success if we await it", async function() {
      this.timeout(5000); // wait 5s
      await updatePropertyLeaseEmail({
        baseLink: "landlord",
        toEmail: rehouserCTO.email,
        lease: lease1,
        user: rehouserCTO,
      });
    });
  });

  // email CEO
  describe("Can email CEO", function() {
    it("Should not fail if we can email the CEO", async function() {
      this.timeout(5000); // wait 5s
      await emailCEO({
        ctx: null,
        subject: "Test email CEO",
        body:
          "This email was sent from the rehouser test suite. asserting the email CEO function works",
      });
    });
  });
});
