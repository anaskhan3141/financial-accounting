const journalService = require('../Services/JournalServices')
const accountService = require('../Services/AccountsServices')
const pool = require('../Connections/DBConnection')

//A L Eq R Ex


module.exports = {

    post: async (req, res, next) => {

        const { reference, description, debit, credit } = req.body;

        (async () => {

            try {
                // Start a MySQL transaction
                await pool.query('START TRANSACTION');
            
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
                await pool.query('ROLLBACK',()=>{
                    console.log("transaction rolled back");
                });
                res.send(error)
            }
            
    
        })();


    },
    getEntry: async (req, res, next) => {
        
        const id = req.query.id
        try {

            const results = await journalService.getEntry(id)

            const groupedData = results.reduce((groups, item) => {
                const group = groups.find(group => group.id === item.id);
                if (group) {
                    group.documents.push(item);
                } else {
                    groups.push({ id: item.id, documents: [item] });
                }
                return groups;
            }, []);


            res.send(groupedData)

        } catch (error) {

            res.send(error)

        }

    },
    getAllEntries: async (req, res, next) => {

        try {

            const results = await journalService.getAllEntries()

            const groupedData = results.reduce((groups, item) => {
                const group = groups.find(group => group.id === item.id);
                if (group) {
                    group.documents.push(item);
                } else {
                    groups.push({ id: item.id, documents: [item] });
                }
                return groups;
            }, []);


            res.send(groupedData)

        } catch (error) {

            res.send(error)

        }

    }

}