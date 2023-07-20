const express = require('express');
const app = express();
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs'); 
const PORT = process.env.port || 5500;
let notes = require('./db/db.json');


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html')); 
});

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
//  return res.json(notes);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html.html')); 
});

app.get('/api/notes:id', (req, res) => {
  if (req.params.id) {
    console.info(`${req.method} request received to get a note with id`);
    const idNote = req.params.id;
    for (let i = 0; i < notes.length; i++) {
      const currentNote = notes[i];
      if (currentNote.id === idNote) {
        res.status(200).json(currentNote);
        return;
      }
    }
    res.status(404).send('Note not found');
  } 
});

app.post('/api/notes', async (req, res) => {
  console.info(`${req.method} request received`);
  
//Handles error in case the note is empty or misses a section
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(500).json('Error in posting Note');
  }

  const newNote = {
    title,
    text,
    id: uuid(),
  };

  try {
    const data = await fsPromises.readFile('./db/db.json', 'utf8');
    const parsedNotes = JSON.parse(data);
    parsedNotes.push(newNote);

    await fsPromises.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4));
    console.info('Success');
    res.json(parsedNotes);
  } catch (err) {
    console.error(err);
    res.status(500).json('Error in posting Note');
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const data = await fsPromises.readFile('./db/db.json', 'utf8');
    const parsedNotes = JSON.parse(data);

    const deletedNoteId = req.params.id;
    const updatedNotes = parsedNotes.filter(note => note.id !== deletedNoteId);

    await fsPromises.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 4));
    console.info('Successfully updated Notes!');
    
    res.json(updatedNotes);
  } catch (err) {
    console.error(err);
    res.status(500).json('Error in deleting Note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);


// app.use('/api', api);
// app.use('/static', express.static(path.join(__dirname, 'public')))
// const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
// const api = require('./routes/notes.js');

// app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/')));
//app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')));

// GET Route for notes page
// app.get('/notes', (req, res) =>
//   res.sendFile(path.join(__dirname, '/notes.html'))
// );
// app.get('api/notes', (req, res) => {
//   const notesFilePath = path.join(__dirname, 'public', 'notes.html');
//   res.sendFile(notesFilePath);
// });

// app.get('*', (req, res) => {
//   const indexPath = path.join(__dirname, 'index.html');
//   res.sendFile(indexPath);
// });
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });


// app.post('./api', (req, res) => {
//   res.json(`${req.method} request received to post`);
 // res.sendFile(path.join(__dirname, '/public/notes.html'))
  // Log that a POST request was received
//   console.info(`${req.method} request received to submit note`);
  

//   // Destructuring assignment for the items in req.body
//   const { title, text } = req.body;

//   // If all the required properties are present
//   if (title && text ) {
//     // Variable for the object we will save
//     const newNote = {
//       title,
//       text,
//       note_id: uuidv4(),
//     };

//     readAndAppend(newNote, './db/db.json');

//     const response = {
//       status: 'success',
//       body: newNote,
//     };

//     res.json(`Tip added successfully 🚀`);
//   } else {
//   res.error('Error in adding note');
//   }
// });