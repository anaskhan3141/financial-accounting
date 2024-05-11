const InventoryServices = require("../Services/InventoryServices")
const journalService = require('../Services/JournalServices')
const accountService = require('../Services/AccountsServices')
const pool = require("../Connections/DBConnection")




module.exports = {


    getAllItemsFromInventory: async (req, res, next) => {


        (async () => {

            try {

                const results = await InventoryServices.getAllItemsFromInventory();
                res.send(results)

            } catch (error) {
                res.send(error)
            }

        })()

    },

    addToInventory: async (req, res, next) => {


        (async () => {
            const { name, category, brand, pricePaid, quantity, paidWithAccount } = req.body;
            const unit_price = pricePaid / quantity
            const description = `${name} inventory purchased`
            const debit = [["merchandise_inventory", pricePaid]]
            const credit = [[paidWithAccount, pricePaid]]

            try {
                // Start a MySQL transaction
                await pool.query('START TRANSACTION');

                const inventory = await InventoryServices.addItemToInventory(name, category, brand, unit_price, quantity)


                // Add entry to the journal table
                const journalEntry = await journalService.addJournalEntry(description);

                // Prepare debit and credit arrays
                const debitArray = debit.map(innerArray => [journalEntry.insertId, ...innerArray]);
                const creditArray = credit.map(innerArray => [journalEntry.insertId, ...innerArray]);

                // Add entries to the debit_entries and credit_entries tables in a batch
                await Promise.all([
                    journalService.addDebitEntry(debitArray),
                    journalService.addCreditEntry(creditArray)
                ]);

                // Post to accounts for debit entries
                await Promise.all(debitArray.map(element => accountService.postToAccount(element[1], journalEntry.insertId, element[2], null)));

                // Post to accounts for credit entries
                await Promise.all(creditArray.map(element => accountService.postToAccount(element[1], journalEntry.insertId, null, element[2])));

                // Commit the transaction
                await pool.query('COMMIT');

                res.send("journal entry added succesfully")

            } catch (error) {
                // Rollback the transaction in case of an error
                await pool.query('ROLLBACK', () => {
                    console.log("transaction rolled back");
                });
                res.send(error)
            }


        })();


    },
    updateItemInInventory: async (req, res, next) => {

        const { itemId, updatedFields } = req.body;

        try {

            const results = await InventoryServices.updateItemInInventory(itemId, updatedFields);
            res.send(results);

        } catch (error) {

            res.status(500).send(error);

        }
    },
    deleteItemFromInventory: async (req, res, next) => {


        const { itemIdToDelete } = req.body; // ID of item to delete

        (async () => {

            try {

                const results = await deleteItemFromInventory(itemIdToDelete);
                res.send(results)

            } catch (error) {
                res.send(error)
            }

        })()

    },
    returnInventory: async (req, res, next) => {

        (async () => {
            const { id, quantity, returnToAccount } = req.body;


            try {
                await pool.query('START TRANSACTION');
                const item = await InventoryServices.getItemFromInventory(id);
                // if(item.quantity<quantity){
                //     console.error("Not enough items in the inventory");
                // }
                const description = `${quantity} pieces of ${item.name} reutrned`


                const amount = item[0].unit_price * quantity
                console.log("amount",amount,);
                const debit = [[returnToAccount, amount]]
                const credit = [["merchandise_inventory", amount]]

                // Add entry to the journal table
                const journalEntry = await journalService.addJournalEntry(description);
                console.log(journalEntry);

                // Prepare debit and credit arrays
                const debitArray = debit.map(innerArray => [journalEntry.insertId, ...innerArray]);
                const creditArray = credit.map(innerArray => [journalEntry.insertId, ...innerArray]);

                console.log("debit", debitArray);
                console.log("credit", creditArray);

                // Add entries to the debit_entries and credit_entries tables in a batch
                await Promise.all([
                    journalService.addDebitEntry(debitArray),
                    journalService.addCreditEntry(creditArray)
                ]);

                // Post to accounts for debit entries
                await Promise.all(debitArray.map(element => accountService.postToAccount(element[1], journalEntry.insertId, element[2], null)));

                // Post to accounts for credit entries
                await Promise.all(creditArray.map(element => accountService.postToAccount(element[1], journalEntry.insertId, null, element[2])));

                await InventoryServices.reduceItemQuantity(id,quantity)

                // Commit the transaction
                await pool.query('COMMIT');

                res.send("journal entry added succesfully")

            } catch (error) {
                // Rollback the transaction in case of an error
                await pool.query('ROLLBACK', () => {
                    console.log("transaction rolled back");
                });
                res.send(error)
            }


        })();

    }

}


