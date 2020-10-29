const nodemailer = require('nodemailer');
const express = require('express');
var bodyParser = require('body-parser');

var config = require('./config.json');
const app = express();
const port = 8080;
app.use(bodyParser.json());
app.listen(port);
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: config.port,
  auth: {
    user: config.user,
    pass: config.pass
  }
});

// const message = {
//   from: 'elonmusk@tesla.com', // Sender address
//   to: 'to@email.com',         // List of recipients
//   subject: 'Design Your Model S | Tesla', // Subject line
//   text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
// };

// transport.sendMail(message, function (err, info) {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(info);
//   }
// });

app.post('/sendEmail', (request, response) => {
  var clientId = request.header('Client-Id');
  var body = request.body;

  console.log('debug 1');
  validateCredentials(clientId, response);
  if (!validateBody(body, response)) { return; };
  console.log('debug 2');

  message.from = body.from;
  message.subject = body.subject;
  message.text = body.text;
  console.log('debug 3');

  sendMail(message, response);
});

function sendMail(input, response) {
  transport.sendMail(input, function (err, info) {
    console.log('debug 4');
    if (err) {
      console.log(err)
      response.status(500).send("Something went wrong: ", err);
    } else {
      response.status(200).send('Email sent!');
    }
  });
}

function decryptValue(value) {
  return Buffer.from(value, 'base64').toString('ascii');
}

function validateCredentials(clientId, response) {
  var decryptedID = decryptValue(clientId);
  if (decryptedID !== config.user) {
    response.status(401).send('Unauthorised: Invalid client Id');
    return;
  }
}

function validateBody(body, response) {
  EMAIL_REGEX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  MESSAGE_REGEX = /^[a-zA-Z-0-9.,\s_$£&€'"@\)\(+\/]+$/;
  NAME_REGEX = /^[ a-zA-Z-']*$/

  if (body.from === '') {
    response.status(400).send('The return email address cannot be empty');
    return false;
  } else if (body.text === '') {
    response.status(400).send('The message cannot be empty');
    return false;
  } else if (body.subject === '') {
    response.status(400).send('The subject cannot be empty');
    return false;
  }

  if (!EMAIL_REGEX.test(body.from)) {
    response.status(400).send('The return email address does not match the standard format');
    return false;
  } else if (!MESSAGE_REGEX.test(body.text)) {
    response.status(400).send('The message contains forbidden characters');
    return false;
  } else if (!MESSAGE_REGEX.test(body.subject)) {
    response.status(400).send('The subject contains forbidden characters');
    return false;
  } else if (!NAME_REGEX.test(body.name)) {
    response.status(400).send('The name contains forbidden characters');
    return false;
  } else {
    return true;
  }
}

var message = {
  from: '',
  to: 'garethclifford9519@gmail.com',
  subject: '',
  text: ''
};
