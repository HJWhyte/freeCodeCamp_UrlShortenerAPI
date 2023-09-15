require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


let mongoose = require('mongoose'); // Import mongoose requirement for DB
const bodyParser = require('body-parser'); // Import response body parsing middleware
const dns = require('dns') // Imports DNS module to allow for url verification
const url = require('url') // Imports module to create URL objects

app.use(bodyParser.urlencoded({extended: false}));  // use body parser middleware for url encoded info

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology : true});  // Connect to database API

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {
  console.log(req.body);
  let url = req.body.url;
  // Validate URL
  try {
    urlObj = new URL(url)
    console.log(urlObj)
    dns.lookup(urlObj.hostname, (err, address, family) => {
      //If DNS does not exist return error
      if (!address) {
        res.json({error: "Invalid URL"})
      }
    })
  }
  catch {
    res.json({error: "Invalid URL"})
  }
});
  

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
