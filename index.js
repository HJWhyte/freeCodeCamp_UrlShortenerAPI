require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


let mongoose = require('mongoose'); // Import mongoose requirement for DB
const bodyParser = require('body-parser'); // Import response body parsing middleware
const dns = require('dns') // Imports DNS module to allow for url verification


app.use(bodyParser.urlencoded({extended: false}));  // use body parser middleware for url encoded info

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology : true});  // Connect to database API

const urlSchema = new mongoose.Schema({
  originalURL : {type : String, required: true, unique: true},
  shortURL : {type : String, required: true, unique: true}
});

let URLModel = mongoose.model('url', urlSchema);


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
  // Validate URL format
  try {
    urlObj = new URL(url)
    console.log(urlObj)
    // Check if url corresponds to valid DNS address
    dns.lookup(urlObj.hostname, (err, address, family) => {
      if (!address) {
        res.json({error: "Invalid URL"})
      }
      // We have valid URL
      else {
        let originalURL = urlObj.href;
        let shortURL = 1;
        // Create response object - url mapping
        resObj = {original_url : originalURL, 
                  short_url: shortURL}
        // Create object into DB model
        let newURL = new URLModel(resObj);
        // Save new model to database
        newURL.save();
        res.json(resObj)
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
