// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
// define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
mailer = require('express-mailer');
var router = express.Router();
var exphbs = require('express-handlebars');
var hbs = exphbs.create({
  partialsDir: [
    'views/partials/'
  ]
});
var http = require('http');
var _ = require("underscore");

mailer.extend(app, {

  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'alikfitz@gmail.com',
    pass: ''
  }

});



// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

var parseString = require('xml2js').parseString;


app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');




app.use(express.static(path.join(__dirname, 'public')));
//XML To JSON
//==============================================================================


//REQUEST
//==============================================================================
var request = require('request');



app.get('/', function(req, res) {



  res.render('listings');
});







app.get('/hemenway', function(req, response) {
  var url = 'https://www.yougotlistings.com/api/rentals/search.php?key=Z6x3y2AYQIVNjFkJ1C8alfcMGEtzuKpgLHn5vRrT&street_name=hemenway&include_mls=1';
  var res = response;
  console.log(request.body);
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function(err, result) {
        console.log(result.YGLResponse.Listings[0].Listing[6]);
        res.render('hemenway', {
          listings: result.YGLResponse.Listings[0].Listing
        });
      });
    }
  });
});

app.get('/hemenway_sales', function(req, res) {

  res.render('hemenway_sales');

});

app.get('/gainsborough', function(req, response) {
  var url = 'https://www.yougotlistings.com/api/rentals/search.php?key=Z6x3y2AYQIVNjFkJ1C8alfcMGEtzuKpgLHn5vRrT&street_name=gainsborough&include_mls=1';
  var res = response;
  console.log(request.body);

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function(err, result) {
        //console.log(result.YGLResponse.Listings[0].Listing);
        res.render('gainsborough', {
          listings: result.YGLResponse.Listings[0].Listing
        });

      });
    }
  });
});

app.get('/gainsborough_sales', function(req, res) {
  res.render('gainsborough_sales');
});

app.get('/sales', function(req, res) {
  res.render('sales');
});

app.post('/sales', function(req, response) {
  console.log('pressed');
  var lid = req.body.listingId;
  console.log('Listing id is ' + lid);
  var url = 'https://www.yougotlistings.com/api/photos/search.php?&key=Z6x3y2AYQIVNjFkJ1C8alfcMGEtzuKpgLHn5vRrT&listing_id=' + lid;
  var res = response;
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function(err, result) {
        var photos = null;
        if (result.YGLResponse.Photos) {
          photos = result.YGLResponse.Photos[0].Photo;
        } else {
          console.log(result);
          console.log('No photos')
          photos = null;
        }

        res.send(photos);
        res.end();
      });
    }
  });
});



app.get('/symphony', function(req, response) {
  var url = 'https://www.yougotlistings.com/api/rentals/search.php?key=Z6x3y2AYQIVNjFkJ1C8alfcMGEtzuKpgLHn5vRrT&street_name=symphony&include_mls=1';
  var res = response;
  console.log(request.body);

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function(err, result) {
        console.log(result.YGLResponse.Listings[0].Listing[6]);
        res.render('symphony', {
          listings: result.YGLResponse.Listings[0].Listing
        });
      });
    }
  });
});

app.get('/symphony_sales', function(req, res) {
  res.render('symphony_sales');
});

app.get('/stephen', function(req, response) {
  var url = 'https://www.yougotlistings.com/api/rentals/search.php?key=Z6x3y2AYQIVNjFkJ1C8alfcMGEtzuKpgLHn5vRrT&street_name=stephen&include_mls=1';
  var res = response;
  console.log(request.body);

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function(err, result) {

        console.log(result.YGLResponse.Listings[0].Listing);


        res.render('stephen', {
          listings: result.YGLResponse.Listings[0].Listing
        });

      });
    }
  });

});

app.get('/stephen_sales', function(req, response) {



  res.render('stephen_sales');



});



app.post('/contact', function(req, res) {
  console.log(req.body.name);
  app.mailer.send('contact', {
    to: 'alikfitz@gmail.com',
    subject: req.body.name,
    pretty: true
  },
    function(err, email) {
      if (err) {
        console.log('Sending Mail Failed!');
        console.log(err);
        return;
      }
      ;

      res.end();

      console.log('sent');
    });
  res.render('listings')
});






// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);