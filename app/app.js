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
app.get('/get-dates', (req, res) => {
    var acuity = Acuity.basic(config);
    return acuity.request('/availability/dates?month=' + req.query.month + '&appointmentTypeID=' + req.query.appointmentTypeID + '&timezone=' + req.query.timezone, function (err, response, dates) {
        if(err) return res.send(err);
        return res.send({
            status: 200,
            dates: dates
        });
    });
});
app.get('/get-times', (req, res) => {
    var acuity = Acuity.basic(config);
    return acuity.request('/availability/times?date=' + req.query.date + '&appointmentTypeID=' + req.query.appointmentTypeID + '&timezone=' + req.query.timezone, function (err, response, times) {
        if(err) return res.send(err);
        return res.send({
            status: 200,
            times: times
        });
    });
});

app.post('/appointments', (req, res) => {
    var options = {
        method: 'POST',
        body: {
            appointmentTypeID: req.body.appointmentTypeID,
            datetime: req.body.datetime,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        }
    };
    console.log('request body ', options);
    var acuity = Acuity.basic(config);
    return acuity.request('/appointments',options, function (err, response, appointment) {
        if(err) return res.send(err);
        return res.send({
            status: 200,
            appointment: JSON.stringify(appointment, null, '')
        });
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
// app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
