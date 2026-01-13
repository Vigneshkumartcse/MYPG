const express = require('express');
const TestingRouter = express.Router();

// Define your testing routes here
TestingRouter.get('/', (req, res) => {
  res.send('Testing route is working!');
});



module.exports = TestingRouter;