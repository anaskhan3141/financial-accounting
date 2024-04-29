const journalService = require('../Services/JournalServices')
const accountService = require('../Services/AccountsServices')

//A L Eq R Ex


module.exports = {

    post: async (req, res, next) => {

        const { reference, description, debit, credit } = req.body;

        (async () => {

            try {
                const journalEntry = await journalService.addJournalEntry(description)

                const debitArray = debit.map(innerArray => [journalEntry.insertId, ...innerArray])
                const creditArray = credit.map(innerArray => [journalEntry.insertId, ...innerArray])


                const debitEntry = await journalService.addDebitEntry(debitArray)
                const creditEntry = await journalService.addCreditEntry(creditArray)

                debitArray.forEach(element => {
                    const result = accountService.postToAccount(element[1], journalEntry.insertId, element[2], null)
                });
                creditArray.forEach(element => {
                    const result = accountService.postToAccount(element[1], journalEntry.insertId, null, element[2])
                });

                res.send('journal entry added')
            } catch (error) {
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