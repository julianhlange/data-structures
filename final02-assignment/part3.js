var express = require('express'),
    app = express();

// Postgres
const { Pool } = require('pg');
var db_credentials = new Object();
db_credentials.user = 'julianhlange';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'hallandfsrdb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

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

// app.listen(process.env.PORT, function() {
app.listen(3000, function() {
    console.log('Server listening...');
});