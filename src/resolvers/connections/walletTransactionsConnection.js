async function walletTransactionsConnection(parent, args, ctx, info) {
  const result = await ctx.db.query.walletTransactionsConnection(
    {
      ...args,
    },
    info
  );
  return result;
}

module.exports = walletTransactionsConnection;
