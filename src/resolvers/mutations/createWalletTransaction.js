async function createWalletTransaction(parent, args, ctx, info) {
  const tx = await ctx.db.mutation.createWalletTransaction(
    {
      ...args,
    },
    info
  );

  return tx;
}

module.exports = createWalletTransaction;
