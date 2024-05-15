const AccountsServices = require('../Services/AccountsServices')


module.exports = {

    income : async (req, res, next) => {

        try {
            
            const accounts = await AccountsServices.getAllAccounts()


            let expenseAccounts = []
            let revenueAccounts = []
            let revenues = []
            let expenses = []

            accounts.forEach(element => {
                if(element.account_type === 'expense'){
                    expenseAccounts.push(element)
                }else if(element.account_type === 'revenue'){
                    revenueAccounts.push(element)
                }
            });

            const expensePromises = expenseAccounts.map(async (element) => {
                const details = await AccountsServices.getAccount(element.account);
                return {
                    accountId:element.id,
                    accountName: element.account,
                    details: details
                };
            });
            
            const revenuePromises = revenueAccounts.map(async (element) => {
                const details = await AccountsServices.getAccount(element.account);
                return {
                    accountId:element.id,
                    accountName: element.account,
                    details: details
                };
            });
            
            revenues = await Promise.all(revenuePromises);
            expenses = await Promise.all(expensePromises);
            revenues.forEach(account => {
                // Initialize total
                let total = 0;
            
                // Iterate over details of the account
                account.details.forEach(detail => {
                    if (detail.debit !== null) {
                        total -= detail.debit; // Subtract debit
                    }
                    if (detail.credit !== null) {
                        total += detail.credit; // Add credit
                    }
                });
            
                // Add total field to the account
                account.total = total;
            });
            expenses.forEach(account => {
                // Initialize total
                let total = 0;
            
                // Iterate over details of the account
                account.details.forEach(detail => {
                    if (detail.debit !== null) {
                        total += detail.debit; // Add debit
                    }
                    if (detail.credit !== null) {
                        total -= detail.credit; // Subtract credit
                    }
                });
            
                // Add total field to the account
                account.total = total;
            });

            // console.log(expenseAccounts);
            // console.log(revenueAccounts);
            res.send({revenues, expenses})


        } catch (error) {
            res.send(error)
        }

    },
    balanceSheet : async (req, res, next) =>{
        try {
            
            const accounts = await AccountsServices.getAllAccounts()
            // console.log(accounts);

            let assetAccounts = []
            let liabilityAccounts = []
            let equityAccounts =[]
            let assets = []
            let liabilities = []
            let equities = []

            accounts.forEach(element => {
                if(element.account_type === 'asset'){
                    assetAccounts.push(element)
                }
                else if(element.account_type === 'liability'){
                    liabilityAccounts.push(element)
                }
                else if(element.account_type === 'equity'){
                    equityAccounts.push(element)
                }
            });
            console.log(equityAccounts);
            const assetPromise = assetAccounts.map(async (element) => {
                const details = await AccountsServices.getAccount(element.account);
                return {
                    accountId:element.id,
                    accountName: element.account,
                    details: details
                };
            });
            
            const liabilityPromise = liabilityAccounts.map(async (element) => {
                const details = await AccountsServices.getAccount(element.account);
                return {
                    accountId:element.id,
                    accountName: element.account,
                    details: details
                };
            });
            const equityPromise = equityAccounts.map(async (element) => {
                const details = await AccountsServices.getAccount(element.account);
                return {
                    accountId:element.id,
                    accountName: element.account,
                    details: details
                };
            });


            
            assets = await Promise.all(assetPromise);
            liabilities = await Promise.all(liabilityPromise);
            equities = await Promise.all(equityPromise);



            assets.forEach(account => {
                // Initialize total
                let total = 0;
            
                // Iterate over details of the account
                account.details.forEach(detail => {
                    if (detail.debit !== null) {
                        total += detail.debit; // Subtract debit
                    }
                    if (detail.credit !== null) {
                        total -= detail.credit; // Add credit
                    }
                });
            
                // Add total field to the account
                account.total = total;
            });
            liabilities.forEach(account => {
                // Initialize total
                let total = 0;
            
                // Iterate over details of the account
                account.details.forEach(detail => {
                    if (detail.debit !== null) {
                        total -= detail.debit; // Add debit
                    }
                    if (detail.credit !== null) {
                        total += detail.credit; // Subtract credit
                    }
                });
            
                // Add total field to the account
                account.total = total;
            });
            equities.forEach(account => {
                // Initialize total
                let total = 0;
            
                // Iterate over details of the account
                account.details.forEach(detail => {
                    if (detail.debit !== null) {
                        total -= detail.debit; // Add debit
                    }
                    if (detail.credit !== null) {
                        total += detail.credit; // Subtract credit
                    }
                });
            
                // Add total field to the account
                account.total = total;
            });

            // console.log(expenseAccounts);
            // console.log(revenueAccounts);
            res.send({assets, liabilities, equities})
            // res.send(accounts)


        } catch (error) {
            res.send(error)
        }
    }

}