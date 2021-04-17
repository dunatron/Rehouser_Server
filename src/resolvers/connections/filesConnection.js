async function filesConnection(parent, args, ctx, info) {
    const result = await ctx.db.query.filesConnection(
      {
        ...args,
      },
      info
    );
    return result;
  }
  
  module.exports = filesConnection;
  