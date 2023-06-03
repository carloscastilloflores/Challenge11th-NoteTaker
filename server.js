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
// app.get('/api/notes', (req, res) =>
//   res.sendFile(path.join(__dirname, '/public/notes.html'))
// );

app.post('./api', (req, res) => {
  res.json(`${req.method} request received to post`);
 // res.sendFile(path.join(__dirname, '/public/notes.html'))
  // Log that a POST request was received
  console.info(`${req.method} request received to submit note`);
  

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text ) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(`Tip added successfully 🚀`);
  } else {
  res.error('Error in adding note');
  }
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

