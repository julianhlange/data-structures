// part 02: get address with latLong
// code is written to be read after cd into final01-assignment folder


var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var apiKey = fs.readFileSync('./../API.txt', 'utf8');
// console.log(apiKey)

request('https://raw.githubusercontent.com/julianhlange/data-structures/master/final01-assignment/addressarraywithoutlatLongv2.json', function(error, response, body) {
    var meetingswithoutlatLong = JSON.parse(body);
    // console.log(meetingswithoutlatLong);

  var meetingsData = [];
  async.eachSeries(meetingswithoutlatLong, function(value, callback) {
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.address.split(' ').join('+') + '&key=' + apiKey;
    var thisMeeting = new Object;
    thisMeeting = value;
    request(apiRequest, function(err, resp, body) {
      if (err) {throw err;}
      thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
      meetingsData.push(thisMeeting);
    });
    // shorten timeout to 250 ms
    setTimeout(callback, 250);
    }, function() {
      require('fs').writeFile('addressarraywithlatLongv2.json', JSON.stringify(meetingsData), function (err) {
        if (err) {
          console.error('error');
        }
      }
    );
  });

});

// then push folder to github to make addressarraywithlatLongv2.json available for next part