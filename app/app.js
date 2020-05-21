var config = require('../config');
const serverless = require('serverless-http');
var Acuity = require('acuityscheduling');
const express = require('express');
const app = express();

app.get('/', function (req, res){
    var acuity = Acuity.basic(config);
    var session = req.session;
    session.appointmentTypes = null;
    session.appointmentTypeID = null;
    session.date = null;
    session.time = null;
    return res;
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/api/info', (req, res) => {
    res.send({ application: 'sample-app', version: '1.0' });
});
app.get('/appointments', (req, res) => {
    var acuity = Acuity.basic(config);
    return acuity.request('appointments', function (err, res, response) {
        //res.send({appointments});

        console.log('twitty appointments JSON = ',JSON.stringify(response));
        return done(response)
    })

});
app.get('/get-months', (req, res) => {
    var acuity = Acuity.basic(config);
    return acuity.request('get-months', function (err, res, response) {
        //res.send({appointments});

        console.log('twitty months JSON = ',JSON.stringify(response));
        return done(response)
    })

});
app.get('/get-times', (req, res) => {
    var acuity = Acuity.basic(config);
    return acuity.request('get-times', function (err, res, response) {
        //res.send({appointments});

        console.log('twitty times JSON = ',JSON.stringify(response));
        return done(response)
    })

});
const done = response => {
    return {
        statusCode: '200',
        body: JSON.stringify(response),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        }
    }
};

app.post('/api/v1/getback', (req, res) => {
    res.send({ ...req.body });
});
//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
