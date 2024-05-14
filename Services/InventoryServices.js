const pool = require('../Connections/DBConnection')


async function generateSKU(category) {

    const count = await getCountByCategory(category);
    return `${category[0]}${String(count + 1).padStart(4, '0')}`;

}


async function getCountByCategory(category) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT COUNT(*) AS count FROM inventory WHERE category = ?',
            [category],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count);
                }
            });
    });
}



module.exports = {

    addItemToInventory: async (name, category, brand, unit_price, quantity) => {
        console.log('test1');

        const SKU = await generateSKU(category);

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO inventory (name, SKU, category, brand, unit_price, quantity) VALUES (?, ?, ?, ?, ?, ?)',
                [name, SKU, category, brand, unit_price, quantity],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    },
    deleteItemFromInventory: async (itemId) => {

        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM inventory WHERE id = ?', [itemId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    updateItemInInventory: async (itemId, updatedFields) => {
        const fieldsToUpdate = [];
        const fieldValues = [];

        // Build the SET clause for the SQL query based on the fields provided
        if (updatedFields.name !== undefined) {
            fieldsToUpdate.push('name = ?');
            fieldValues.push(updatedFields.name);
        }
        if (updatedFields.category !== undefined) {
            fieldsToUpdate.push('category = ?');
            fieldValues.push(updatedFields.category);
        }
        if (updatedFields.brand !== undefined) {
            fieldsToUpdate.push('brand = ?');
            fieldValues.push(updatedFields.brand);
        }
        if (updatedFields.unit_price !== undefined) {
            fieldsToUpdate.push('unit_price = ?');
            fieldValues.push(updatedFields.unit_price);
        }
        if (updatedFields.quantity !== undefined) {
            fieldsToUpdate.push('quantity = ?');
            fieldValues.push(updatedFields.quantity);
        }

        // Construct the SQL query dynamically based on the fields to be updated
        const query = `UPDATE inventory SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;

        return new Promise((resolve, reject) => {
            // Execute the SQL query with the field values and item ID
            pool.query(query, [...fieldValues, itemId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    getAllItemsFromInventory: async () => {

        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM inventory', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }, 
    getItemFromInventory: async (id) => {

        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM inventory WHERE id=?',[id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }, 
    reduceItemQuantity: async (itemId, quantityToReduce) => {
        console.log("item reduce func");
        return new Promise((resolve, reject) => {

            pool.query('UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
                [quantityToReduce, itemId],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    }
    , 
    increaseItemQuantity: async (itemId, quantityToIncrease) => {
        console.log("item increase func");
        return new Promise((resolve, reject) => {

            pool.query('UPDATE inventory SET quantity = quantity + ? WHERE id = ?',
                [quantityToIncrease, itemId],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    }

}










