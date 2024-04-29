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
                const account = await accountsService.getAccount("accounts")

                for (let i = 0; i < account.length; i++) {
                    if (account[i].account == accountName) {
                        const result = await accountsService.getAccount(accountName)
                        console.log(result)
                        res.send(result)
                    }

                }
                res.send('no such account')


            } catch (error) {
                res.send(error)

            }
        })()

    }
}