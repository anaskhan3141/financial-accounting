const pool = require('../Connections/DBConnection')
const { getAllEntries, getEntry } = require('../Controllers/JournalController')

module.exports = {

    addJournalEntry: async (description) => {

        return new Promise((resolve, reject) => {

            const query = `
            INSERT INTO accounting.journal
            (description)
            VALUES
            (?);
            `
            values = [description]
            pool.query(query, values, (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            })

        })

    },
    addDebitEntry: async (values) => {

        return new Promise((resolve, reject) => {

            const query = `
            INSERT INTO accounting.debit_entries
            (journal_id, debit_account, debit_amount)
            VALUES
            ?;
            `
            pool.query(query, [values], (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            })

        })

    },
    addCreditEntry: async (values) => {

        return new Promise((resolve, reject) => {

            const query = `
            INSERT INTO accounting.credit_entries
            (journal_id, credit_account, credit_amount)
            VALUES
            ?;
            `
            pool.query(query, [values], (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            })

        })

    },
    getEntry: async (id)=>{
        return new Promise((resolve, reject) => {

            const query = "SELECT journal.*, debit_entries.debit_account, debit_entries.debit_amount, credit_entries.credit_account, credit_entries.credit_amount FROM journal INNER JOIN debit_entries ON journal.id = debit_entries.journal_id INNER JOIN credit_entries ON journal.id = credit_entries.journal_id WHERE journal.id = ?;"

            pool.query(query, [id], (error, results) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })

    },
    getAllEntries: async () => {

        return new Promise((resolve, reject) => {

            const query = "SELECT journal.*, debit_entries.debit_account, debit_entries.debit_amount, credit_entries.credit_account, credit_entries.credit_amount FROM journal INNER JOIN debit_entries ON journal.id = debit_entries.journal_id INNER JOIN credit_entries ON journal.id = credit_entries.journal_id;"

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