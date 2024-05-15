const pool = require("../Connections/DBConnection")
const InventoryServices = require("../Services/InventoryServices")
const journalService = require('../Services/JournalServices')
const accountService = require('../Services/AccountsServices')

module.exports = {

    sellItem: async (req, res, next) => {
        const { id, quantity } = req.body

        try {

            // await pool.query("START TRANSACTION")

            const item = await InventoryServices.getItemFromInventory(id)
            const salePrice = (item[0].unit_price) + (item[0].unit_price)/10;
            const unitPrice =item[0].unit_price

            const description = `${quantity} units of ${item[0].name} purchased`
            const debit1 = [["cash", salePrice*quantity]]
            const credit1 = [["sales_revenue", salePrice*quantity]]

            // Add entry to the journal table
            const journalEntry1 = await journalService.addJournalEntry(new Date, description);

            // Prepare debit and credit arrays
            const debitArray1 = debit1.map(innerArray => [journalEntry1.insertId, ...innerArray]);
            const creditArray1 = credit1.map(innerArray => [journalEntry1.insertId, ...innerArray]);

            // Add entries to the debit_entries and credit_entries tables in a batch
            await Promise.all([
                journalService.addDebitEntry(debitArray1),
                journalService.addCreditEntry(creditArray1)
            ]);

            // Post to accounts for debit entries
            await Promise.all(debitArray1.map(element => accountService.postToAccount(element[1], journalEntry1.insertId, element[2], null)));

            // Post to accounts for credit entries
            await Promise.all(creditArray1.map(element => accountService.postToAccount(element[1], journalEntry1.insertId, null, element[2])));

            //-------------------------------------------------------------------------------------------------------
            const description2 = `cost of goods sold`
            const debit2 = [["cogs", unitPrice*quantity]]
            const credit2 = [["merchandise_inventory", unitPrice*quantity]]

            // Add entry to the journal table
            const journalEntry2 = await journalService.addJournalEntry(new Date, description2);

            // Prepare debit and credit arrays
            const debitArray2 = debit2.map(innerArray => [journalEntry2.insertId, ...innerArray]);
            const creditArray2 = credit2.map(innerArray => [journalEntry2.insertId, ...innerArray]);

            // Add entries to the debit_entries and credit_entries tables in a batch
            await Promise.all([
                journalService.addDebitEntry(debitArray2),
                journalService.addCreditEntry(creditArray2)
            ]);

            // Post to accounts for debit entries
            await Promise.all(debitArray2.map(element => accountService.postToAccount(element[1], journalEntry2.insertId, element[2], null)));

            // Post to accounts for credit entries
            await Promise.all(creditArray2.map(element => accountService.postToAccount(element[1], journalEntry2.insertId, null, element[2])));

            await InventoryServices.reduceItemQuantity(id, quantity)
            // await pool.query('COMMIT');



            res.send("ok")


        } catch (error) {
            // await pool.query('ROLLBACK', () => {
            //     console.log("transaction rolled back");
            // });
            res.send(error)
        }

    },
    saleReturn: async (req, res, next) => {
        const { id, quantity } = req.body
        try {

            // await pool.query("START TRANSACTION")

            const item = await InventoryServices.getItemFromInventory(id)
            const salePrice = (item[0].unit_price) + (item[0].unit_price)/10;
            const unitPrice =item[0].unit_price

            const description = `${quantity} units of ${item[0].name} sale return`
            const debit1 = [["sales_revenue", salePrice*quantity]]
            const credit1 = [["cash", salePrice*quantity]]

            // Add entry to the journal table
            const journalEntry1 = await journalService.addJournalEntry(new Date, description);

            // Prepare debit and credit arrays
            const debitArray1 = debit1.map(innerArray => [journalEntry1.insertId, ...innerArray]);
            const creditArray1 = credit1.map(innerArray => [journalEntry1.insertId, ...innerArray]);

            // Add entries to the debit_entries and credit_entries tables in a batch
            await Promise.all([
                journalService.addDebitEntry(debitArray1),
                journalService.addCreditEntry(creditArray1)
            ]);

            // Post to accounts for debit entries
            await Promise.all(debitArray1.map(element => accountService.postToAccount(element[1], journalEntry1.insertId, element[2], null)));

            // Post to accounts for credit entries
            await Promise.all(creditArray1.map(element => accountService.postToAccount(element[1], journalEntry1.insertId, null, element[2])));

            //-------------------------------------------------------------------------------------------------------
            const description2 = `cost of goods sold decreased`
            const debit2 = [["merchandise_inventory", unitPrice*quantity]]
            const credit2 = [["cogs", unitPrice*quantity]]

            // Add entry to the journal table
            const journalEntry2 = await journalService.addJournalEntry(new Date, description2);

            // Prepare debit and credit arrays
            const debitArray2 = debit2.map(innerArray => [journalEntry2.insertId, ...innerArray]);
            const creditArray2 = credit2.map(innerArray => [journalEntry2.insertId, ...innerArray]);

            // Add entries to the debit_entries and credit_entries tables in a batch
            await Promise.all([
                journalService.addDebitEntry(debitArray2),
                journalService.addCreditEntry(creditArray2)
            ]);

            // Post to accounts for debit entries
            await Promise.all(debitArray2.map(element => accountService.postToAccount(element[1], journalEntry2.insertId, element[2], null)));

            // Post to accounts for credit entries
            await Promise.all(creditArray2.map(element => accountService.postToAccount(element[1], journalEntry2.insertId, null, element[2])));

            await InventoryServices.increaseItemQuantity(id, quantity)
            // await pool.query('COMMIT');



            res.send("ok")


        } catch (error) {
            // await pool.query('ROLLBACK', () => {
            //     console.log("transaction rolled back");
            // });
            res.send(error)
        }

    }

}