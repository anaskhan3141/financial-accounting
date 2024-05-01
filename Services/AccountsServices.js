const pool = require('../Connections/DBConnection');


module.exports = {
    createAccount: async (accountName) => {
        return new Promise((resolve, reject) => {


            const query = `CREATE TABLE IF NOT EXISTS ${accountName} (
                id INT AUTO_INCREMENT PRIMARY KEY,
                reference INT,
                debit DECIMAL(10,2),
                credit DECIMAL(10,2),
                FOREIGN KEY (reference) REFERENCES journal(id)
            );
            `;


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
        return new Promise((resolve, reject) => {

            const query = `INSERT INTO accounts (account, account_type) VALUES (?, ?)`

            const values = [accountName, accountType]

            pool.query(query, values, (error, results) => {
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


            // const query = `SELECT * FROM ${accountName};`;
            const query = `SELECT j.date AS journal_date,
                            j.description AS journal_description,
                         c.*
                         FROM journal j
                        JOIN ${accountName} c ON j.id = c.reference;
                         `


            pool.query(query, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
        })

    },
    getAllAccounts: async (accountName) => {

        return new Promise((resolve, reject) => {

            const query = `SELECT * FROM accounts;`

            pool.query(query, (error, results) => {
                if (error) {
                    reject(error)

                } else {
                    resolve(results)
                }
            })

        })

    }
}


