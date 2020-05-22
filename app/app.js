

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
//  Our only doctor and appointment type, maybe in future we will add more doctors and types but for now just leave constant
 const sonnySaggar = {
     appointmentTypeID: 14310202,
     calendarID: 3843792

 };

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
// ************ docs to API https://developers.acuityscheduling.com/reference#get-availability-dates *********
app.get('/get-dates', (req, res) => {
    var acuity = Acuity.basic(config);
    return acuity.request('get-months', function (err, res, response) {
        //res.send({appointments});

        console.log('twitty months JSON = ',JSON.stringify(response));
        return done(response)
    })

});

// https://acuityscheduling.com/api/v1/availability/times
app.get('/get-times', (req, res) => {
    var acuity = Acuity.basic(config);
    return acuity.request('get-times', function (err, res, response) {
        //res.send({appointments});

        console.log('twitty times JSON = ',JSON.stringify(response));
        return done(response)
    })

});

/*
TODO:
example of how they post appointment is in the link, we need to grab the name of the patient from the URL or pass it through angular components no session or i guess
we could im not picky. We will need add if paid success post appointment
https://github.com/AcuityScheduling/acuity-js/blob/master/examples/create-appointment/index.js
 */
var options = {
    method: 'POST',
    body: {
        appointmentTypeID : 1,
        datetime          : '2016-04-01T09:00',
        firstName         : 'Bob',
        lastName          : 'McTest',
        email             : 'bob.mctest@example.com'
    }
};

// Make the create appointment request:
acuity.request('/appointments', options, function (err, res, appointment) {
    if (err) return console.error(err);
    console.log(appointment);
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

//sample end point not for app
app.post('/api/v1/getback', (req, res) => {
    res.send({ ...req.body });
});
//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);
