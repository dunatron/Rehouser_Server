async function bankAccountsConnection(parent, args, ctx, info) {
  const result = await ctx.db.query.bankAccountsConnection(
    {
      ...args,
    },
    info
  );
  return result;
}

module.exports = bankAccountsConnection;
