async function walletTransaction(parent, args, ctx, info) {
  return ctx.db.query.walletTransaction(
    {
      ...args,
    },
    info
  );
}

module.exports = walletTransaction;
