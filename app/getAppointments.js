var config = require('../config');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
var Acuity = require('acuityscheduling');
const express = require('express');
const app = express();
app.use(bodyParser.json({ strict: false }));
app.use(express.json());
app.get('/appointments', (req, res) => {
    var acuity = Acuity.basic(config);
    return acuity.request('appointments', function (err, res, appointments) {
       // res.send({appointments});
        console.log('twitty', appointments );
        return appointments
    })

});
/*exports.handler = async (event) => {
    console.log('twitty log =', event);
    if (event.httpMethod === 'GET') {
        var acuity = Acuity.basic(config);
        console.log('inside if statement');
        let response =  acuity.request('/appointments', function (err, response, appointments) {
            // if (err) return console.error(err);
            console.log('twitty log response =', response);
            console.log('twitty log appointments =', appointments);
        });
        return done(response);
    }
};

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
const getAppointments = async event => {
    console.log('inside get method');
    var acuity = Acuity.basic(config);
   return acuity.request('/appointments', function (err, response, appointment) {
        if (err) return console.error(err);
        console.log('twitty log response =', appointment);

    })
};*/
