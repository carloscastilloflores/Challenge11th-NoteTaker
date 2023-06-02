const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

const api = require('./routes/notes.js');

const PORT = process.env.port || 5500;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

