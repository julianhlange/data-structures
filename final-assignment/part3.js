var request = require('request');

var collName = 'meetings';

request('https://raw.githubusercontent.com/julianhlange/data-structures/master/final-assignment/addressesWithLatLong.json', function(error, response, body) {
    var meetingData = JSON.parse(body);

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