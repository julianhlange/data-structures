// PART 1: CREATE ARRAY CONTAINING STREET ADDRESSES

var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('week01-assignment/m04.txt');

var $ = cheerio.load(content);

// create the array
var streetAddressArray = [];
// push addresses into the array
$('table table table tbody').find('tr').each(function(i, elem){
  var streetAddress = $(elem).find('td').eq(0).contents().filter(function(){ 
    return this.nodeType == 3;
  }).eq(2);
  // add some replacements to format everything (e.g., St. to Street) the same way; maybe it is poor practice though to look at data and try to find differences?
  streetAddressArray.push($(streetAddress).text().trim().split(',')[0].split('Rm')[0].split('-')[0].replace('St.', 'Street').replace('W.', "West").replace('St ', 'Street').replace('Street ', 'Street'));
});
// console.log to check output
console.log(streetAddressArray);


// PART 2: ALTER ARRAY

// create array of addresses with "New York, NY"
var fullAddressArrayFinal = [];
// loop through array to add ', New York, NY' to each
for (var i=0; i < streetAddressArray.length; i++) {
  fullAddressArrayFinal[i] = streetAddressArray[i] + ', New York, NY'
}
// console.log to check output
console.log(fullAddressArrayFinal);


// PART 3: MODIFY STARTER CODE AND WRITE ARRAY TO TEXT FILE

// IN TERMINAL: start by installing async package (as per http://caolan.github.io/async/) with the following command:
//    npm install --save async
var request = require('request'); // npm install request
var async = require('async'); // npm install async
// IN TERMINAL: don't want key in code, so create environment variable with the following commands:
//    export GoogleMapsAPIKey="123456"
//    printenv | grep GoogleMapsAPIKey
// in code below, refer to this environment variable

var apiKey = process.env.GoogleMapsAPIKey;

var meetingsData = [];
// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(fullAddressArrayFinal, function(value, callback) {
    // this finally worked when I removed the '='' character from '&key=' in the starter code... although I'm not sure why
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+') + '&key' + apiKey;
    // the following code, which lacks the key, also works, but maybe because the number is below maximum allowed without key
    // var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+');
    var thisMeeting = new Object;
    thisMeeting.address = value;
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
        meetingsData.push(thisMeeting);
    });
    // shorten timeout to 250 ms
    setTimeout(callback, 250);
}, function() {
    require('fs').writeFile('week03-assignment/m04addressarray.txt', JSON.stringify(meetingsData), function (err) {
      if (err) {
        console.error('error');
      }
    }
  );
});