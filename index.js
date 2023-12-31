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
  original_url : {type : String, required: true, unique: true},
  short_url : {type : String, required: true, unique: true}
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
  console.log('Request Body:', req.body);
  let url = req.body.url;
  // Validate URL format
  try {
    urlObj = new URL(url)
    console.log('URL Object', urlObj)
    // Check if url corresponds to valid DNS address
    dns.lookup(urlObj.hostname, (err, address, family) => {
      if (!address) {
        res.json({error: "invalid url"})
      }
      // We have valid URL
      else {
        let originalURL = urlObj.href;
        let shortURL = Math.floor(Math.random()*100000).toString();;
        // Create response object - url mapping
        resObj =  { original_url : originalURL,  
                  short_url: shortURL }
        // Create object into DB model
        let newURL = new URLModel(resObj);
        console.log('URL DB Model:', newURL)
        // Save new model to database
        newURL.save();
        res.json(resObj)
      }
    })
  }
  catch {
    res.json({error: "invalid url"})
  }
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  console.log('Request Params:', req.params)
  // Find short url from database
  URLModel.findOne({short_url: req.params.shorturl}).then((foundURL) => {
    console.log('Found URL:',foundURL);
    // If short URL found redirect to associated original url 
    if (foundURL) {
    let og_url = foundURL.original_url
    res.redirect(og_url)
    }
    else {
      res.json({error: 'No short url found'})
    }
  })
})
  
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
