const pool = require('../Connections/DBConnection')
const accountsService = require('../Services/AccountsServices')


module.exports = {
    createAccount: async (req, res, next) => {

        const { accountName, accountType } = req.body;
        (async () => {
            try {
                const result = await accountsService.createAccount(accountName)
                const result2 = await accountsService.addAccountName(accountName, accountType)

                res.send("table created succesfully")

            } catch (error) {
                res.send("error creating table")

            }
        })()

    },
    getAccountDetails: async (req, res, next) => {

        const accountName = req.query.accountName;
        (async () => {
            try {

                const result = await accountsService.getAccount(accountName)
                res.send(result)


            } catch (error) {
                res.send(error)

            }
        })()

    },
    getAllAccountDetails : async (req, res, next)=>{
        console.log("trial balance");
        try {
            let results = [];

            const accounts = await accountsService.getAllAccounts();
            
            const promises = accounts.map(async (element) => {
                const details = await accountsService.getAccount(element.account);
                return {
                    accountId:element.id,
                    accountName: element.account,
                    details: details
                };
            });
            
            results = await Promise.all(promises);
            
            console.log(results);
            
            res.send(results)

        } catch (error) {
            
            res.send(error)

        }

    },
    getAllAcountNames: async (req, res, next)=>{

        try {
            const accounts = await accountsService.getAllAccounts();

            res.send(accounts)

        } catch (error) {
            res.send(error)
        }

    }
}