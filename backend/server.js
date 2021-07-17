const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Store environment variables in the .env file
require('dotenv').config();

// Create express server
const app = express();

// Setup dynamic port but also configure a default of 5000
const port = process.env.PORT || 5000;

// Setup Cors middleware
app.use(cors());

// Allow us to parse json
app.use(express.json());

// Setup connection to MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

// Setup Router
const wealthsRouter = require('./routes/wealths');
app.use('/wealths',wealthsRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})


// run "nodemon server" from the backend directory
// *Note, may run into error stating "cannot be loaded because running scripts is disabled on this system."
//      To get around it, open powershell as admin and run "Set-ExecutionPolicy RemoteSigned" to allow running scripts
//      Make sure to run "Set-ExecutionPolicy Restricted" when done