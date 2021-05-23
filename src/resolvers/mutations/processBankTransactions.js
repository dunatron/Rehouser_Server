async function processBankTransactions(parent, { data }, ctx, info) {
  var processedItems = [];
  for (const transaction of data) {
    const item = await doProcess({ transaction: transaction, ctx, info });
    processedItems.push(item);
  }
  return processedItems;
}

const bankAccQuery = `{ id, amount }`;
const doProcess = async ({ transaction, ctx, info }) => {
  //   throw new Error("Testing 333");
  // forEach Item do what you need to do then return the batch

  // 1. try and get the bank account.
  const bnkAccountFrmDb = await ctx.db.query.bankAccount(
    {
      where: {
        id: transaction.accountNumber,
      },
    },
    bankAccQuery
  );

  // 2. get or make the bank account
  //   const bankAccount =
  //     bnkAccountFrmDb !== null
  //       ? bnkAccountFrmDb
  //       : await ctx.db.mutation.createBankAccount(
  //           {
  //             data: {
  //               id: transaction.accountNumber,
  //               amount: 0,
  //             },
  //           },
  //           bankAccQuery
  //         );

  const bankAccount =
    bnkAccountFrmDb !== null
      ? bnkAccountFrmDb
      : await ctx.db.mutation.createBankAccount(
          {
            data: {
              id: transaction.accountNumber,
              amount: 0,
            },
          },
          bankAccQuery
        );

  return {
    ...transaction,
    bankAccount: bankAccount,
  };

  // 2. try and get the transaction first, it may have already been added
  const txFrmDb = await ctx.db.query.bankTransaction({
    where: {
      id: transaction.id,
    },
  });

  if (txFrmDb !== null) {
    // we already have this transaction
    return;
  }

  // create the transaction
  const tx = await ctx.db.query.bankTransaction(
    {
      data: {
        ...transaction,
        bankAccount: {
          connect: {
            id: bankAccount.id,
          },
        },
      },
    },
    info
  );
  // 4. create the tx in the db

  // finally update the bank account with the new transaction

  // 2. process the transaction onto the Bank Account.
  // 3. A bank transaction could Also have some REFS on it to indicate to do other THINGS

  console.log(" bank account from DB => ", bnkAccountFrmDb);
  // 2. if we dont have a bank account then we need to create it!
  // 3. we need to try and then get the transaction
  // 4. if we have no transaction we create it on the bank account. we also do an additions or deductions against the bank account

  return tx;
};

// {
// id: '202105240004',
// accountNumber: '0309150417517000',
// date: '20210524',
// reference: '21/05 20:34',
// amount: -11,
// txCode: '',
// txType: 'EFTPOS TRANSACTION',
// source: '',
// otherPart: 'Sessions',
// particulars: '524651******',
// analysisCode: '0579',
// serialNumber: '',
// accountCode: '',
// rehouserTransaction: false,
// bankAccount: { create: [Object] }
// },

module.exports = processBankTransactions;

// mutation {
// processBankTransactions(data:[
//     {
//     id: "",
//     accountNumber: "String"
//     date: "DateTime"
//     reference: "String"
//     amount: 120.0
//     txCode: "String"
//     txType: "String"
//     source: "String"
//     otherPart: "String"
//     particulars: "String"
//     analysisCode: "String"
//     serialNumber: "String"
//     accountCode: "String"
//     uniqueBnkTxId: "String"
//     rehouserTransaction: true,
//     bankAccount: {
//         create:{
//         id: "123123123",
//         amount:0
//         }
//     }
//     }
// ]) {
//     id
// }
// }
