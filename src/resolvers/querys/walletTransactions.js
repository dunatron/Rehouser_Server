async function walletTransactions(parent, args, ctx, info) {
  return ctx.db.query.walletTransactions(
    {
      ...args,
    },
    info
  );
}

module.exports = walletTransactions;
