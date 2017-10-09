// part 02: return address with latLong
// note that the code is still working without API key (maybe because limited number of items); need to fix this at some point

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var apiKey = process.env.GoogleMapsAPIKey;

request('https://raw.githubusercontent.com/julianhlange/data-structures/master/week0506-assignment/m04addressarraywithoutlatLong.json', function(error, response, body) {
    var meetingswithoutlatLong = JSON.parse(body);
    // console.log(meetingswithoutlatLong);

  var meetingsData = [];
  async.eachSeries(meetingswithoutlatLong, function(value, callback) {
    // var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.address.split(' ').join('+') + '&key=' + apiKey;
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.address.split(' ').join('+');
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
      require('fs').writeFile('week0506-assignment/m04addressarraywithlatLong.json', JSON.stringify(meetingsData), function (err) {
        if (err) {
          console.error('error');
        }
      }
    );
  });

});