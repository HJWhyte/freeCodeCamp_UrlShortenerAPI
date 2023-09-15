require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let mongoose = require('mongoose'); // Import mongoose requirement for DB
const bodyParser = require('body-parser'); // Import response body parsing middleware

app.use(bodyParser.urlencoded())

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology : true});  // Connect to database API

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});