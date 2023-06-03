const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
//  return res.json(notes);
});

// notes.get('/', (req, res) => {
//   console.info(`${req.method} request received for notes`);
//   readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
// });

// POST Route for submitting notes
// const postNote = (note) => 
// fetch ('/api/notes', {
//   method: 'POST', 
//   headers: {
//     'Content-Type':'application/json',
//   },
//   body: JSON.stringify(note),
// })
//   .then((res) => res.json())
//   .then((data) => {
//     console.log('Successful POST request:', data); 
//     return data; 
//   })
//   .catch((error) => {
//     console.error('Error in POST request:', error);
//   }); 

notes.post('/', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit note`);
  console.log(req.body);

  let response;
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (req.body) {
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

    res.json(response);
  } else {
    res.json('Error in posting notes');
  }
});

// notes.post('/', (req, res) => {
//     console.info(`${req.method} request received to add a note`);
    
//     let response; 

//     if (req.body && req.body.product) {
//       response = {
//         status: 'success',
//         data: req.body,
//       };
//       res.status(201).json(response);
//     } else {
//       res.status(400).json('Request body must at least contain something')
//     }
//     });

module.exports = notes;