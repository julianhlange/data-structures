// part 01: use code from week02 and week03 assignments - this gets Google-formatted street address - and add more pieces of info
// question is how to get separate array of meetings for each location

var fs = require('fs');
var cheerio = require('cheerio');

var filename = 'week01-assignment/m04.txt'
var content = fs.readFileSync(filename);

var $ = cheerio.load(content);

////////////////////////////////////////////////////////////////////////////////////////////////////////
// make an array in which each index is one meeting/time/location
// this may not be ideal in that it repeats the name/location-specific info, but that can be fixed
// i.e., more ideal way may be to have all meeting days/times nested within each location
// see week0506-assignment-notes-1.js for array of name/location array

var outputMeetings = [];

  $('table table table tbody').find('tr').find('td').find('b:contains("s From")').each(function(i, elem){   // may need to revise the 'b:contains("***")' search string depending on other zones

    var objectMeetings = {};

  // name of meeting
  objectMeetings.name = $(elem).parent().parent().find('td').eq(0).find('b').contents().filter(function(){
    return this.nodeType == 3;
  }).text().split(' - ')[0].replace(/\\/g, '').replace(/ +/g, " ");

  // name of location
  objectMeetings.location = $(elem).parent().parent().find('td').eq(0).find('h4').contents().filter(function(){
    return this.nodeType == 3;
  }).text();

  // Google-formatted address
  objectMeetings.address = $(elem).parent().parent().find('td').eq(0).contents().filter(function(){
    return this.nodeType == 3;
  }).eq(2).text().trim().split(',')[0].split('Rm')[0].split('-')[0].replace('St.', 'Street').replace('W.', "West").replace('St ', 'Street').replace('Street ', 'Street') + ', New York, NY';

  // complete address with room and floor info
  objectMeetings.detail = $(elem).parent().parent().find('td').eq(0).contents().filter(function(){
    return this.nodeType == 3;
  }).eq(2).text().trim().slice(0, -1).replace('St.', 'Street').replace('W.', "West").replace('St ', 'Street');

  // directions information
  objectMeetings.directions = $(elem).parent().parent().find('td').eq(0).contents().filter(function(){
    return this.nodeType == 3;
  }).eq(3).text().trim()
  // .split('Avenues')[0].split('Streets')[0].split(')')[0]
  .replace('Between', 'between').replace('Betw.', 'between').replace('Betw', 'between').replace('Btw.', 'between')
  .replace('street', 'Street').replace('Aves', 'Avenues').replace('Avenues.', 'Avenues').replace('avenue', 'Avenue').replace('Avenuess', 'Avenues')
  .replace('Off', 'off').replace('@', 'at').replace('at28th', 'at 28th').replace('Corner', 'corner').replace('Enter', 'enter')
  .replace('5th Av)', '5th Avenue)')
  .replace(/[{()}]/g, '')
  .slice(0, -6).split(' NY')[0]
  ;

  // wheelchair access
  var temp = $(elem).parent().parent().find('td').eq(0).contents().filter(function(){
    return this;
  }).text().trim();
  var count = temp.split('Wheelchair access').length - 1;
  // console.log(count)
  if (count == 1) {
    objectMeetings.wheelchair = 'yes'}
  else { objectMeetings.wheelchair = 'no'}
  
  // notes about special days
  objectMeetings.notes = $(elem).parent().parent().find('td').eq(0).find('div').contents().filter(function(){
    return this;
  }).eq(0).text().trim();

    // day
    objectMeetings.day = $(elem).contents().text().replace('s From', '');
    
    // time (hour, minute, AMorPM) at start and end
    objectMeetings.startHour = $(elem).contents().text().get(2).nodeValue.trim().split(":")[0];
    // objectMeetings.startMinute = $(elem).parent().contents().get(2).nodeValue.trim().split(":")[1].slice(0, -3);
    // objectMeetings.startAMPM = $(elem).parent().contents().get(2).nodeValue.trim().slice(-2);
    // objectMeetings.endHour = $(elem).parent().contents().get(4).nodeValue.trim().split(":")[0];
    // objectMeetings.endMinute = $(elem).parent().contents().get(4).nodeValue.trim().split(":")[1].slice(0, -3);
    // objectMeetings.endAMPM = $(elem).parent().contents().get(4).nodeValue.trim().slice(-2);

    outputMeetings.push(objectMeetings);
  });

console.log(outputMeetings);

// require('fs').writeFile(
//     'week0506-assignment/m04addressarraywithoutlatLong.json',
//     JSON.stringify(outputMeetings),
//     function (err) {
//         if (err) {
//             console.error('error');
//         }
//     }
// );