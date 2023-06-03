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
// app.use('/static', express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/')));
//app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')));

// GET Route for notes page
// app.get('/notes', (req, res) =>
//   res.sendFile(path.join(__dirname, '/notes.html'))
// );
app.get('api/notes', (req, res) => {
  const notesFilePath = path.join(__dirname, 'public', 'notes.html');
  res.sendFile(notesFilePath);
});

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });


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

