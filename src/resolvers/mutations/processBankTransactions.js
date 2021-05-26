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

  // 2. try and get the transaction first, it may have already been added

  const txFrmDb = await ctx.db.query.bankTransaction({
    where: {
      id: transaction.id,
    },
  });

  if (txFrmDb !== null) {
    // we already have this transaction. Dont trhow an error keep going
    return {
      ...transaction,
      bankAccount: bankAccount,
      errorMessage: "Transaction has already been added to the database",
    };
  }

  // create the transaction
  // const tx = await ctx.db.mutation.bankTransaction(
  //   {
  //     data: {
  //       ...transaction,
  //       bankAccount: {
  //         connect: {
  //           id: bankAccount.id,
  //         },
  //       },
  //     },
  //   },
  //   info
  // );
  // delete transaction.bankAccount as its a create statement
  console.log("BANK ACCOUNT => ", bankAccount);
  delete transaction.bankAccount;
  const updatedBankAccount = await ctx.db.mutation.updateBankAccount(
    {
      data: {
        amount: bankAccount.amount + transaction.amount,
        transactions: {
          create: [
            {
              ...transaction,
              id: transaction.id,
              amount: transaction.amount,
              date: transaction.date,
            },
          ],
        },
      },
      where: {
        id: bankAccount.id,
      },
    },
    `{ id amount }`
  );

  return {
    ...transaction,
    bankAccount: updatedBankAccount,
    errorMessage: "Transaction has already been added to the database",
  };

  // do any logic that needs to be done with the transaction

  // query the transaction to get any info needed on it

  // 4. create the tx in the db

  // finally update the bank account with the new transaction

  // 2. process the transaction onto the Bank Account.
  // 3. A bank transaction could Also have some REFS on it to indicate to do other THINGS

  // ToDo: get the property lease if it has a code === PLBR by the ref of bankRef === nanoid digits
  // particulars, code, reference that all have 12 chars. use one for the type i.e our code. reference is the leaseID
  // code => PLBR for property lease banking ref. then the reference is the leasebankingRef number
  const updatedLeaseWithPayments = await ctx.db.query.propertyLease(
    {
      where: {
        bankRef: bankRef,
      },
    },
    info
  );

  console.log(" bank account from DB => ", bnkAccountFrmDb);

  const finalTx = await ctx.db.query.bankTransaction(
    {
      where: {
        id: transaction.id,
      },
    },
    info
  );

  return finalTx;
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
