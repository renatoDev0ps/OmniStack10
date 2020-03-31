const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect('mongodb://root:mongodb@localhost:27017/week10?authSource=admin', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.use(express.json());
app.use(routes);

app.listen(3332);