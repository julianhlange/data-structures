// enter into EC2 instance
// use Linux command in email to connect with mongo shell
// go to database with command: use julian
// create new collection with command: db.createCollection('meetings')
// quit()
// enter url as environment variable

var request = require('request');

// var dbName = 'julian';
var collName = 'meetings';

request('https://raw.githubusercontent.com/julianhlange/data-structures/master/final01-assignment/addressarraywithlatLongv3.json', function(error, response, body) {
    var meetingData = JSON.parse(body);
    // console.log(meetingData);

    // Connection URL
    // var url = fs.readFileSync('./../ATLAS.txt', 'utf8');
    // console.log(url);
    var url = process.env.ATLAS;
    

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