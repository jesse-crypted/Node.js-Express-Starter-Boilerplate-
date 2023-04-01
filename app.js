const express = require('express');
const { model } = require('mongoose');
const app = express();

const userRouter = require('./routes/userRoute');
// const jobRouter = require('./routes/jobRoute');

// MIDDLEWARES
app.use(express.json()); // used to parse incoming JSON data in the request body

app.use('/api/v1/users', userRouter);
// app.use('/api/v1/jobs', jobRouter);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

module.exports = app;
