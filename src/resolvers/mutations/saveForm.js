async function saveForm(parent, args, ctx, info) {
  // we want the client to tell us to either save or create so we dont have to do an extra fetch
  // so we could do a query that does getSavedForm. if it retuned null then we would know it is
  // even better is to use the id of the Saveform. If we have that, update, else create
  // When saved for the first time, we can set the saveFormId when it comes back for saves after on the same instance

  //   id: ID! @unique @id
  //   createdAt: DateTime! @createdAt
  //   updatedAt: DateTime! @updatedAt
  //   name: String
  //   url: String
  //   identifier: String
  //   user: User! @relation(name: "UserSavedForms")
  //   json: Json

  const {
    data: { id, name, path, json, user, identifier },
  } = args;

  console.log("SAVED FORM ARGS => ", args);
  //   throw new Error("You must be logged in to Save Forms!");

  const loggedInUserId = ctx.request.userId;
  //   const loggedInUserId = "rehouser-cto-id";

  //   if (!loggedInUserId) {
  //     throw new Error("You must be logged in to Save Forms!");
  //   }

  const serverIdentifier = `${loggedInUserId}-${name}-${path}`;

  const sharedData = {
    identifier: serverIdentifier,
    name: name,
    path: path,
    json: json,
  };

  console.log("Shared Data => ", sharedData);

  const newSavedForm = id
    ? await ctx.db.mutation.updateSavedForm(
        {
          data: {
            ...sharedData,
          },
          where: {
            id: id,
          },
        },
        info
      )
    : await ctx.db.mutation.createSavedForm(
        {
          data: {
            identifier: serverIdentifier,
            ...sharedData,
            // user: {
            //   connect: {
            //     id: "rehouser-cto-id",
            //   },
            // },
            // user: {
            //   ...user,
            // },
            user: {
              connect: {
                // id: loggedInUserId,
                id: loggedInUserId,
              },
            },
          },
        },
        info
      );

  return newSavedForm;
}

module.exports = saveForm;
