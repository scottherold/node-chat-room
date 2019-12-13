// *** This module is the entry point to the application *** //

// *** MODULES *** //
// ** native Modules ** //
const path = require('path')

// ** npm Modules ** //
const express = require('express');

// *** SERVER CREATION *** //
const app = express();
const port = process.env.PORT;

// *** EXPRESS CONFIG *** //
// ** Paths ** //
const publicDirectoryPath = path.join(__dirname, '../public');

// ** Config ** //
app.use(express.static(publicDirectoryPath));

// *** SERVER ROUTING *** //
app.get('', (req, res) => {
    res.render('index.html');
});

// *** SERVER INSTANTIATION *** //
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});