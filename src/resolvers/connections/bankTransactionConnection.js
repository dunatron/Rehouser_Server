async function bankTransactionConnection(parent, args, ctx, info) {
  const result = await ctx.db.query.bankTransactionsConnection(
    {
      ...args,
    },
    info
  );
  return result;
}

module.exports = bankTransactionConnection;
