const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
// notes.get('/', (req, res) => {
//   console.info(`${req.method} request received for notes`);
//   readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
// });

notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
});

// POST Route for submitting notes
notes.post('/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit note`);

  // // Destructuring assignment for the items in req.body
  // const { email, feedbackType, feedback } = req.body;

  // // If all the required properties are present
  // if (email && feedbackType && feedback) {
  //   // Variable for the object we will save
  //   const newFeedback = {
  //     email,
  //     feedbackType,
  //     feedback,
  //     feedback_id: uuid(),
  //   };

  //   readAndAppend(newFeedback, './db/feedback.json');

  //   const response = {
  //     status: 'success',
  //     body: newFeedback,
  //   };

  //   res.json(response);
  // } else {
  //   res.json('Error in posting feedback');
  // }
});



module.exports = notes;