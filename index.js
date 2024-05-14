const express = require('express');
const cors = require('cors')
require('dotenv').config();

const pool = require('./Connections/DBConnection')

const app = express()

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({
  origin: '*' // Allow requests from this origin only
}));


// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));


const accountsRoute = require('./Routes/AccountRoute')
const journalRoute = require('./Routes/JournalRoute')
const inventoryRoute = require ('./Routes/InventoryRoute')
const saleRoute = require ('./Routes/SaleRoute')


app.use('/account', accountsRoute)
app.use('/journal', journalRoute)
app.use('/inventory', inventoryRoute)
app.use('/sale', saleRoute)







app.use((req, res) => {
  res.status(404).send('Page not found');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
