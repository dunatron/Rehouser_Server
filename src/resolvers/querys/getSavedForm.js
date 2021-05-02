/**
 * When this function is called it is always fetched by the user who is logged in and also by the identifier
 */
async function getSavedForm(parent, args, ctx, info) {
  const saveForm = await ctx.db.query.savedForm(
    {
      ...args,
    },
    info
  );
  return saveForm;
}

module.exports = getSavedForm;
