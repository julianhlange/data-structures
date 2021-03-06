var fs = require('fs');
var cheerio = require('cheerio');

var outputMeetings = [];

var filenumber = ['m01','m02','m03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10'];

for (var i = 0; i < filenumber.length; i++) {
  var filename = '../week01-assignment/' + filenumber[i] + '.txt';
  var content = fs.readFileSync(filename);
  var $ = cheerio.load(content);

  $('table table table tbody').find('tr').each(function(i, elem) {

    var meetingAllInfo = $(elem).find('td').eq(1).html().trim().split('<br>\n                    \t<br>\n                    \t\n\t\t\t\t  \t    <b>');
    var meetingAllInfoCount = meetingAllInfo.length;
    for (var j = 0; j < meetingAllInfoCount; j++) {
      
      var objectMeetings = new Object;

      var meetingInfo = $(meetingAllInfo[j]).text().trim();
      
      // name of meeting
      objectMeetings.name = $(elem).find('td').eq(0).find('b').contents().filter(function() {
        return this.nodeType == 3;
      }).text().split(' - ')[0].replace(/\\/g, '').replace(/ +/g, ' ');

      // name of location
      objectMeetings.location = $(elem).find('td').eq(0).find('h4').contents().filter(function() {
        return this.nodeType == 3;
      }).text();

      // Google-formatted address
      objectMeetings.address = $(elem).find('td').eq(0).contents().filter(function() {
        return this.nodeType == 3;
      }).eq(2).text().trim().split(',')[0].split('Rm')[0].split(' -')[0].split(' \(')[0].replace('St.', 'Street').replace('W.', 'West').replace('St ', 'Street').replace('STREET', 'Street')
      // edit two troublemakers
      .replace('189th Street & Bennett Avenue', '178 Bennett Avenue')
      .replace('Central Park West & 76th Street', 'West 76th Street & Central Park West')
      + ', New York, NY';

      // complete address with room and floor info
      objectMeetings.detail = $(elem).find('td').eq(0).contents().filter(function() {
        return this.nodeType == 3;
      }).eq(2).text().trim().slice(0, -1).replace('St.', 'Street').replace('W.', 'West').replace('St ', 'Street')

      // directions information
      objectMeetings.directions = $(elem).find('td').eq(0).contents().filter(function() {
          return this.nodeType == 3;
        }).eq(3).text().trim()
        .replace('Between', 'between').replace('Betw.', 'between').replace('Betw', 'between').replace('Btw.', 'between')
        .replace('street', 'Street').replace('Aves', 'Avenues').replace('Avenues.', 'Avenues').replace('avenue', 'Avenue').replace('Avenuess', 'Avenues')
        .replace('Off', 'off').replace('@', 'at').replace('at28th', 'at 28th').replace('Corner', 'corner').replace('Enter', 'enter')
        .replace('5th Av)', '5th Avenue)')
        .replace(/[{()}]/g, '')
        .slice(0, -6).split(' NY')[0];

      // day and time
      objectMeetings.day = meetingInfo.split('s From')[0];
      var startHour = meetingInfo.split('s From')[1].split(':')[0].trim();
      objectMeetings.startHour = parseInt(startHour);
      objectMeetings.startMinute = meetingInfo.split(':')[1].slice(0, 2);
      objectMeetings.startAMPM = meetingInfo.split(':')[1].slice(3, 5);
      var endHour = meetingInfo.split('to')[1].split(':')[0].trim();
      objectMeetings.endHour = parseInt(endHour);
      objectMeetings.endMinute = meetingInfo.split(':')[2].slice(0, 2);
      objectMeetings.endAMPM = meetingInfo.split(':')[2].slice(3, 5);
      if (objectMeetings.startAMPM == 'AM' && objectMeetings.startHour==12) {
        objectMeetings.startHourMil = 0
      }
      else if (objectMeetings.startAMPM == 'AM' && objectMeetings.startHour<12) {
        objectMeetings.startHourMil = objectMeetings.startHour
      }
      else if (objectMeetings.startAMPM == 'PM' && objectMeetings.startHour==12) {
        objectMeetings.startHourMil = 12
      }
      else { objectMeetings.startHourMil = objectMeetings.startHour + 12 }

      // meeting type
      var typeCount = meetingInfo.split('Meeting Type').length - 1;
      if (typeCount == 1) {
        objectMeetings.type = meetingInfo.split('Meeting Type')[1].split('meeting')[0].trim();
      }
      else { objectMeetings.type = '' };

      // special interest
      var specialCount = meetingInfo.split('Special Interest').length - 1;
      if (specialCount == 1) {
        objectMeetings.special = meetingInfo.split('Special Interest')[1]
      }
      else { objectMeetings.special = '' };

      // wheelchair access
      var tempwheelchair = $(elem).find('td').eq(0).contents().text().trim();
      var wheelchaircount = tempwheelchair.split('Wheelchair access').length - 1;
      if (wheelchaircount == 1) {
        objectMeetings.wheelchair = 'yes'
      }
      else { objectMeetings.wheelchair = 'no' };

      // wheelchair access
      var tempwheelchair = $(elem).find('td').eq(0).contents().text().trim();
      var wheelchairCount = tempwheelchair.split('Wheelchair access').length - 1;
      if (wheelchairCount == 1) {
        objectMeetings.wheelchair = 'yes'
      }
      else { objectMeetings.wheelchair = 'no' };

      // notes
      objectMeetings.notes = $(elem).find('td').eq(0).find('div').contents().eq(0).text().trim();

      outputMeetings.push(objectMeetings);
    };
  });
};

require('fs').writeFile(
    'addresses.json',
    JSON.stringify(outputMeetings),
    function (err) {
        if (err) {
            console.error('error');
        }
    }
);