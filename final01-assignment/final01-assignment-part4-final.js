var express = require('express'),
    app = express();
var fs = require('fs');
var moment = require('moment-timezone');

// Postgres
const { Pool } = require('pg');
var db_credentials = new Object();
db_credentials.user = 'julianhlange';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'hallandfsrdb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Mongo
var collName = 'meetings';
var MongoClient = require('mongodb').MongoClient;
var url = process.env.ATLAS;

// HTML wrappers for AA data
var html1 = fs.readFileSync('final01-assignment-html1v5-work.txt');
var html2 = fs.readFileSync('final01-assignment-html2v17-work.txt');

app.get('/', function(req, res) {
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query
    var q = `WITH add_prev as (
                    SELECT *,
                    LAG(hallsensor) OVER (ORDER BY lastheard) as prev_hallsensor,
                    LAG(fsrsensor) OVER (ORDER BY lastheard) as prev_fsrsensor FROM sensordata
                ),
                add_change as(
                    SELECT *,
                    (CASE WHEN not hallsensor AND prev_hallsensor THEN 1 ELSE 0 END) as change_hallsensor,
                    (CASE WHEN (fsrsensor < 20) AND (prev_fsrsensor > 20) THEN 1 ELSE 0 END) as change_fsrsensor FROM add_prev
                )

            SELECT date_trunc('day', lastheard) as date,
                SUM(change_hallsensor) as fridgeclosed_hallsensor,
                SUM(change_fsrsensor) as fridgeclosed_fsrsensor FROM add_change
            GROUP BY date
            ORDER BY date;`;

    client.connect();
    client.query(q, (qerr, qres) => {
        res.send(qres.rows);
        console.log('responded to request');
    });
    client.end();
});

app.get('/aa', function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) { return console.dir(err); }

        var today = moment.tz(new Date(), "America/New_York").days();
        var todayDay;
        var tomorrowDay;
        if (today == 0) {todayDay = 'Sunday'; tomorrowDay = 'Monday'}
        else if (today == 1) {todayDay = 'Monday'; tomorrowDay = 'Tuesday'}
        else if (today == 2) {todayDay = 'Tuesday'; tomorrowDay = 'Wednesday'}
        else if (today == 3) {todayDay = 'Wednesday'; tomorrowDay = 'Thursday'}
        else if (today == 4) {todayDay = 'Thursday'; tomorrowDay = 'Friday'}
        else if (today == 5) {todayDay = 'Friday'; tomorrowDay = 'Saturday'}
        else if (today == 6) {todayDay = 'Saturday'; tomorrowDay = 'Sunday'};
        
        var nowHour = moment.tz(new Date(), "America/New_York").hours();
        var endHour = 4;

        var collection = db.collection(collName);

        collection.aggregate([ // start of aggregation pipeline
            // match by day and time - show all that start between now and 4am tomorrow morning
            { $match : 
                { $or : [
                    { $and: [
                        { day : todayDay } , { startHourMil : { $gte: nowHour } }
                    ]},
                    { $and: [
                        { day : tomorrowDay } , { startHourMil : { $lte: endHour } }
                    ]}
                ]}
            },

            // group by meeting group
            {
                $group: {
                    _id: {
                        latLong: '$latLong',
                        meetingName: '$name',
                        meetingAddress1: '$address',
                    },
                    meetingDay: { $push: '$day' },
                    meetingStartHour: { $push: '$startHour' },
                    meetingStartMinute: { $push: '$startMinute' },
                    meetingStartAMPM: { $push: '$startAMPM' },
                    meetingEndHour: { $push: '$endHour' },
                    meetingEndMinute: { $push: '$endMinute' },
                    meetingEndAMPM: { $push: '$endAMPM' },
                    meetingType: { $push: '$type' }
                }
            },

            // group meeting groups by latLong
            {
                $group: {
                    _id: {
                        latLong: '$_id.latLong'
                    },
                    meetingGroups: { $push: { groupInfo: '$_id', meetingDay: '$meetingDay', meetingStartHour: '$meetingStartHour', meetingStartMinute: '$meetingStartMinute', meetingStartAMPM: '$meetingStartAMPM', meetingEndHour: '$meetingEndHour', meetingEndMinute: '$meetingEndMinute', meetingEndAMPM: '$meetingEndAMPM', meetingType: '$meetingType' } }
                }
            }

        ]).toArray(function(err, docs) { // end of aggregation pipeline
            if (err) { console.log(err) }

            else {
                res.writeHead(200, { 'content-type': 'text/html' });
                res.write(html1);
                res.write(JSON.stringify(docs));
                res.end(html2);
            }
            db.close();
        });
    });

});

// app.listen(process.env.PORT, function() {
app.listen(3000, function() {
    console.log('Server listening...');
});