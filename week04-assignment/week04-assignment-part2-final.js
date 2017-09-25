// week04 assignment in two parts: this is part 2
// having created json file in part 1 with week04-assignment-part2-final.js, continue here with part 2

// in mongo shell, run the following two commands
//      use aaLocations
//      db.createCollection('meetings')

// modify starter code below to change database name and collection name that were set up in mongo shell
// in terminal, enter command node week04-assignment-part2-final.js
// in mongo shell, confirm correct number (52) in 'meetings' collection

var request = require('request');

var dbName = 'aaLocations';
var collName = 'meetings';

request('https://raw.githubusercontent.com/julianhlange/data-structures/master/week04-assignment/m04addressarray.json', function(error, response, body) {
    var meetingData = JSON.parse(body);

    // Connection URL
    var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;

    // Retrieve
    var MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(url, function(err, db) {
        if (err) {return console.dir(err);}

        var collection = db.collection(collName);

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        collection.insert(meetingData);
        db.close();

    });

});