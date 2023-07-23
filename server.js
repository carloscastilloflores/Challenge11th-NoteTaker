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
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
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
//1 Not updating properly 
// app.post('/api/notes', async (req, res) => {
//   console.info(`${req.method} request received`);
  
// //Handles error in case the note is empty or misses a section
//   const { title, text } = req.body;
//   if (!title || !text) {
//     return res.status(500).json('Error in posting Note');
//   }

//   const newNote = {
//     title,
//     text,
//     id: uuid(),
//   };

//   try {
//     const data = await fsPromises.readFile('./db/db.json', 'utf8');
//     const parsedNotes = JSON.parse(data);
//     parsedNotes.push(newNote);

//     await fsPromises.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4));
//     console.info('Success');
//     res.json(parsedNotes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json('Error in posting Note');
//   }
// });
//2. Trying to improve
// app.post('/api/notes', (req, res)=>{
//   console.info(`${req.method} request received`);
//   const { title, text } = req.body;
//   if (title && text) {
//     const newNote = {
//       title,
//       text,
//       id: uuid(),
//     };
//     fs.readFile('./db/db.json', 'utf8', (err, data) => {
//       if (err) {
//         console.error(err);
//       } else {
//         const parsedNotes = JSON.parse(data);
//         parsedNotes.push(newNote);
//         notes = parsedNotes
//         console.log(parsedNotes)
//         fs.writeFile('./db/db.json',JSON.stringify(parsedNotes, null, 4),
//           (writeErr) =>
//             writeErr
//               ? console.error(writeErr)
//               : console.info('success')
//         );
//         res.json(notes)
//       }
//     });
//   } else {
//     res.status(500).json('Error in posting Note');
//   }
// })

app.post('/api/notes', (req, res)=>{
  console.info(`${req.method} request received`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        notes = parsedNotes
        console.log(parsedNotes)
        fs.writeFile('./db/db.json',JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('success')
        );
        res.json(notes)
     }
    });
  } else {
    res.status(500).json('Error in posting Note');
  }
})

app.delete("/api/notes/:id", (req, res) => {
   // Read the contents of the 'db.json' file asynchronously
  fs.readFile("./db/db.json", "utf8", (error, data) => {
    if (error) {
      console.error(error);
       // If there's an error reading the file, send a 500 (Internal Server Error) response with an error message
      return res.status(500).json({ message: "Error reading data" });
    }
    const deleteId = req.params.id;
    console.log("ID to be deleted: ", deleteId);
    // Parse the contents of 'db.json' into an array of notes
    const notesArray = JSON.parse(data);
    
    // Find the index of the note to be deleted using the specified deleteId
    const indexToDelete = notesArray.findIndex((note) => note.id === deleteId);
    if (indexToDelete === -1) {
    // If the specified note's ID is not found in the array, send a 404 (Not Found) response with an error message
      return res.status(404).json({ message: "Note not found" });
    }
    // Remove the note from the array using the indexToDelete
    notesArray.splice(indexToDelete, 1)
    // Update the 'notes' variable with the modified 'notesArray';
    notes = notesArray
     // Write the modified 'notesArray' back to the 'db.json' file
    fs.writeFile("./db/db.json", JSON.stringify(notesArray, null, 4), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
         // If there's an error writing the file, send a 500 (Internal Server Error) response with an error message
        return res.status(500).json({ message: "Error updating data" });
      }
      console.info('Successfully updated');
      // Send the modified 'notesArray' as the response in JSON format
      res.json(notesArray);
    });
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
