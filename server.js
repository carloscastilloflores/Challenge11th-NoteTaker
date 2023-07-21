const express = require('express');
const app = express();
const path = require('path');
const uuid = require('./helper/uuid');
const fs = require('fs'); 

let notes = require('./db/db.json');

const fsPromises = require('fs/promises');
// const { readFromFile } = require('./helper/fsUtils');

const PORT = process.env.PORT || 5500;
// function readFromFile(filePath) {
//   return fsPromises.readFile(filePath, 'utf8');
// }

app.use(express.static('public'));

// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname,"/public/index.html"));
});

app.get("/notes", function (req, res)  {
  res.sendFile(path.join(__dirname,"/public/notes.html")); 
});

app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  // readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
 return res.json(notes);
});

// app.get("/api/notes")
//   .get(function (req, res) {
//     res.json(notes);
//   })
  
//   .post(function (req, res) {
//     let jsonFilePath = path.join(__dirname, "/db/db.json");
//     let newNote = req.body; 

//     let highestId = 99;

//     for (let i = 0; i < notes.length; i++) {
//       let individualNote = database[i];

//       if (individualNote.id > highestId) {
//         highestId = individualNote.id;
//       }
//     }
//     newNote.id = highestId + 1; 
//     notes.push(newNote)
//     fs.writeFile(jsonFilePath, JSON.stringify(notes), function (err) {
//       if (err) {
//         return console.log(err);
//       }
//       console.log("Your note was saved!");
//     })
//     res.json(newNote); 
//   }); 

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
