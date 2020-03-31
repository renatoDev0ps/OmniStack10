const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

mongoose.connect('mongodb://root:mongodb@localhost:27017/week10?authSource=admin', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.listen(3333);