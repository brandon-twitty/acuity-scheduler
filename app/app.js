var config = require('../config');
const serverless = require('serverless-http');
var Acuity = require('acuityscheduling');
const express = require('express');
const app = express(),
    cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', function (req, res){
    var acuity = Acuity.basic(config);
    var session = req.session;
    session.appointmentTypes = null;
    session.appointmentTypeID = null;
    session.date = null;
    session.time = null;
    return res;
});
app.get('/api/info', (req, res) => {
    res.send({ application: 'sample-app', version: '1.0' });
});
app.get('/appointments', (req, res) => {
    var acuity = Acuity.basic(config);
    return acuity.request('appointments', function (err, response) {
        if(err) return err;
        console.log('twitty appointments JSON = ',JSON.stringify(response));
        return res.send(response);
    });
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
