//seed.js
const db = require("./db");
const seeds = require("./seeds/index");
const { addPropertySearchNode } = require("./lib/algolia/propertySearchApi");
const { addUserSearchNode } = require("./lib/algolia/userSearchApi");
const bcrypt = require("bcryptjs");

const { imagesList, userList, propertiesList } = seeds;

async function main() {
  // createImages
  await imagesList.forEach(async (img) => {
    await db.mutation.createFile({
      data: { ...img },
    });
  });

  // create users
  await userList.forEach(async (user) => {
    const password = await bcrypt.hash(user.password, 10);
    const res = await db.mutation.createUser({
      data: { ...user, password: password },
    });
    await addUserSearchNode({
      userId: res.id,
      db: db,
    }).catch((e) => console.log("AN promise err => ", e));
  });

  // createProperties
  await propertiesList.forEach(async (property) => {
    const res = await db.mutation
      .createProperty({
        data: { ...property },
      })
      .catch((e) => console.log("Create Property err => ", e));

    await addPropertySearchNode({
      propertyId: res.id,
      db: db,
    }).catch((e) => console.log("AN promise err => ", e));
  });
}

main().catch((e) => console.log(e));
