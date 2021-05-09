const {
  updatePropertySearchNode,
} = require("../../lib/algolia/propertySearchApi");
const { _isOwnerOrAgent } = require("../../lib/_isOwnerOrAgent");

const propertyQueryString = `{ id agents {id} owners {id} }`;

async function syncPropertySearchState(parent, { id }, ctx, info) {
  // first take a copy of the updates
  const loggedInUserId = ctx.request.userId;

  if (!ctx.request.userPermissions) {
    throw new Error("trying to attach permissions to the request");
  }

  // need to be logged in
  if (!loggedInUserId) {
    throw new Error("You must be logged in!");
  }
  const item = await ctx.db.query.property(
    { where: { id: id } },
    propertyQueryString
  );
  const isOwnerOrAgent = _isOwnerOrAgent({ property: item, ctx });

  if (!isOwnerOrAgent) {
    throw new Error(
      `You must be an owner, Agent or Wizard to sync this property with our search platform`
    );
  }

  // update the property in algolia
  const messageString = await updatePropertySearchNode({
    // property: updatedProperty,
    propertyId: id,
    ctx,
  });

  return { message: messageString };
}

module.exports = syncPropertySearchState;
