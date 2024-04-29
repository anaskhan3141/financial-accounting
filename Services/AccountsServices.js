const pool = require('../Connections/DBConnection')


module.exports = {
    createAccount: async (accountName) => {
        return new Promise((resolve, reject) => {


            const query = `CREATE TABLE IF NOT EXISTS ${accountName} (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            reference VARCHAR(45),
                            debit DECIMAL(10,2),
                            credit DECIMAL(10,2)
                            );`;


            pool.query(query, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
        })

    },

    addAccountName: async (accountName, accountType) => {
        return new Promise((resolve, reject)=>{

            const query = `INSERT INTO accounts (account, account_type) VALUES (?, ?)`

            const values = [accountName, accountType]

            pool.query(query, values, (error, results)=>{
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
                    resolve("successfully added to accounts")                    
                }
            })

        })
    },

    postToAccount: async (accountName, reference, debit, credit) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ${accountName} (reference, debit, credit) VALUES (?, ?, ?)`;
            const values = [reference, debit, credit];

            pool.query(sql, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    getAccount: async (accountName) => {

        return new Promise((resolve, reject) => {


            const query = `SELECT * FROM ${accountName};`;


            pool.query(query, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
        })

    },
    getAccountType: async (accountName) =>{

        return new Promise((resolve, reject)=>{

            const query = `SELECT account_type FROM accounts WHERE account="${accountName}";
            `

            pool.query(query, (error, results)=>{
                if (error) {
                    reject(error)
                    
                } else {
                    resolve(results[0].account_type)
                }
            })

        })

    }
}


