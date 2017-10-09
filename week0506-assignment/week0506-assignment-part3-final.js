// part 03: use week04 assignment and revise

// first create database and collection in mongo
// use week0506-assignment-db
//      switched to db week0506-assignment-db
// db.createCollection('meetings')
//      { "ok" : 1 }

// at a couple of stages in this exercise, cleared collection with the following code in mongo
// db.collection.remove('meetings')
//      WriteResult({ "nRemoved" : 0 })
// > db.collection.count()
//      0

var fs = require('fs');
var request = require('request');

var dbName = 'week0506-assignment-db';
var collName = 'meetings';

request('https://raw.githubusercontent.com/julianhlange/data-structures/master/week0506-assignment/m04addressarraywithlatLong.json', function(error, response, body) {
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

    }); //MongoClient.connect

}); //request