// part 04: use starter code for week0506 assignment to make specific query of meetings on Tuesdays on or after 7PM
// when filtering for time below, it looks like the number are strings (i.e., $gte 7 idoes not return anything), maybe because output of stringify in part 01 converts any number to a string

var fs = require('fs');
var request = require('request');

var dbName = 'week0506-assignment-db';
var collName = 'meetings';

var myQuery = [
    { $match : { day : "Tuesday" } },               // filter for day = Tuesday
    { $match : { $or: [{ startHour: '7' }, { startHour: '8' }, { startHour: '9' }, { startHour: '10' }, { startHour: '11' }] } },       // filter for start time of >= 7 // better would be be to revise output of part 1 to number
    { $match : { startAMPM : "PM" } },              // filter for evening
    ];

request('https://raw.githubusercontent.com/julianhlange/data-structures/master/week0506-assignment/m04addressarraywithlatLong.json', function(error, response, body) {
    var meetingData = JSON.parse(body);

    // Connection URL
    var url = 'mongodb://' + process.env.IP + ':27017/' + dbName;

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; 

MongoClient.connect(url, function(err, db) {
    if (err) {return console.dir(err);}

    var collection = db.collection(collName);

    // query
    collection.aggregate( myQuery ).toArray(function(err, docs) {
        if (err) {console.log(err)}
        
        else {
            console.log("Writing", docs.length, "documents as a result of this aggregation.");
            fs.writeFileSync('week0506-assignment/m04mongoaggregation.JSON', JSON.stringify(docs, null, 4));
        }
        db.close();
        
    });

}); //MongoClient.connect

});