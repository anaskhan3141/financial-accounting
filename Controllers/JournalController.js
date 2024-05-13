const journalService = require('../Services/JournalServices')
const accountService = require('../Services/AccountsServices')
const pool = require('../Connections/DBConnection')

//A L Eq R Ex


module.exports = {

    post: async (req, res, next) => {

        const { date, description, debit, credit } = req.body;

        (async () => {

            try {
                // Start a MySQL transaction
                await pool.query('START TRANSACTION');
            
                // Add entry to the journal table
                const journalEntry = await journalService.addJournalEntry(date, description);
            
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
            const result = []
            groupedData.forEach(element => {
                let data = {
                    id: element.id,
                    date: element.documents[0].date,
                    description:element.documents[0].description,
                    documents: {
                        debit:[],
                        credit:[]
                    }
                }
                let debit = []
                let credit = []
                element.documents.forEach(item=>{
                    if (item.debit_account && item.debit_amount) {
                        if (!data.documents.debit.some(itm => itm.account === item.debit_account)) {
                            data.documents.debit.push({ account: item.debit_account, amount: item.debit_amount });

                        }
                    }
                    if (item.credit_account && item.credit_amount) {
                        if (!data.documents.credit.some(itm => itm.account === item.credit_account)) {
                            data.documents.credit.push({ account: item.credit_account, amount: item.credit_amount });

                        }

                    }
                })
                // data.documents.push(debit)
                // data.documents.push(credit)

                result.push(data)
                
            });

            res.send(result)

        } catch (error) {

            res.send(error)

        }

    }

}