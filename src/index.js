const nodemailer = require('nodemailer');
const express = require('express');
var bodyParser = require('body-parser');

var config = require('./config.json');
const app = express();
const port = 8080;
app.use(function (req, resp, next) {
    resp.header("Access-Control-Allow-Origin", "*");
    resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Client-Id");
    next();
})
app.options('*', function (req, res) { res.sendStatus(200); });
app.use(bodyParser.json());
app.listen(port);
var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: config.port,
    secure: true,
    auth: {
        user: config.user,
        pass: config.pass
    }
});

app.post('/sendEmail', (request, response) => {
    var clientId = request.header('Client-Id');
    var body = request.body;

    try {
        if (!validateCredentials(clientId, response)) { return; };
    } catch (error) {
        throw new CustomError(403, "403 Forbidden", "Something went wrong with validating your credentials");
    }
    if (!validateBody(body, response)) { return; };

    console.log('Validations all passed')

    buildHtmlMessage(body);
    message.html = buildHtmlMessage(body);

    sendMail(message, response);
});

function sendMail(input, response) {
    transport.sendMail(input, function (err, info) {
        if (err) {
            console.log(err)
            response.status(500).send("Something went wrong: ", err);
            throw new CustomError(500, "Internal Server Error", "Something went wrong: " + err);
        } else {
            response.json(200, { response: 'Email sent!' });
        }
    });
}

function decryptValueHex(value) {
    return Buffer.from(value, 'hex').toString('ascii');
}

function decryptValueBase(value) {
    return Buffer.from(value, 'base64').toString('ascii');
}

function validateCredentials(clientId, response) {
    console.log('Validating credentials')
    if (!clientId) {
        response.status(401).send('No value found for header: Client-Id');
        return false;
    }
    var firstDecrypted = decryptValueHex(clientId);
    var secondDecrypted = decryptValueBase(firstDecrypted);
    if (secondDecrypted !== config.pass) {
        response.status(401).send('Unauthorised: Invalid client Id');
        return false;
    } return true;
}

function validateBody(body, response) {
    console.log('Validating body')
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

function buildHtmlMessage(body) {
    return `
          <h2>An request has been submitted for more information from <span style="font-style: italic; font-weight=bold">techyBoy<span></h2>
          <ul>
              <li>From: <span style="font-style: italic; font-weight=bold">` + body.from + `</span></li>
              <li>Name: <span style="font-style: italic; font-weight=bold">` + body.name + `</span></li>
              <li>Subject: <span style="font-style: italic; font-weight=bold">` + body.subject + `</span></li>
              <li>Message:
                <span style="font-style: italic; font-weight=bold">` + body.text + `</span></li>
          </ul>
          <table id="zs-output-sig" border="0" cellpadding="0" cellspacing="0"
          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse; width:425px;">
          <tbody>
              <tr>
                  <td>
                      <table border="0" cellpadding="0" cellspacing="0"
                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                          <tbody>
                              <tr>
                                  <td>
                                      <table border="0" cellpadding="0" cellspacing="0"
                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                          <tbody>
                                              <tr>
                                                  <td>
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                                          <tbody>
                                                              <tr>
                                                                  <td>
                                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td
                                                                                      style="border-collapse:collapse;font-family:Tahoma, Geneva, sans-serif;font-size:14.0px;font-style:normal;line-height:16px;font-weight:normal;">
                                                                                      <span
                                                                                          style="font-family:Tahoma, Geneva, sans-serif;font-size:14.0px;font-style:normal;line-height:16px;font-weight:normal;color:#8b8b8b;display:inline;">Kind
                                                                                          Regards,</span></td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td
                                                                                      style="border-collapse:collapse;padding-bottom:7px;height:7px;">
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
              <tr>
                  <td>
                      <table border="0" cellpadding="0" cellspacing="0"
                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                          <tbody>
                              <tr>
                                  <td width="128">
                                      <table border="0" cellpadding="0" cellspacing="0"
                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                          <tbody>
                                              <tr>
                                                  <td style="border-collapse:collapse;line-height:0px;"><img height="128"
                                                          width="128" alt="" border="0"
                                                          src="https://y5t6h9a6.stackpathcdn.com/53dd481a-eee5-4a51-84ee-b3a7e91bc1b1/img.png">
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td style="border-collapse:collapse;padding-bottom:10px;height:10px;">
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                                  <td width="9" style="border-collapse:collapse;padding-right: 9px;width: 9px;"></td>
                                  <td>
                                      <table border="0" cellpadding="0" cellspacing="0"
                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                          <tbody>
                                              <tr>
                                                  <td>
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                                          <tbody>
                                                              <tr>
                                                                  <td>
                                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td
                                                                                      style="border-collapse:collapse;font-family:Tahoma, Geneva, sans-serif;font-size:14.0px;font-style:normal;line-height:16px;font-weight:bold;">
                                                                                      <span
                                                                                          style="font-family:Tahoma, Geneva, sans-serif;font-size:14.0px;font-style:normal;line-height:16px;font-weight:bold;color:#0482b7;display:inline;">techyBoy&nbsp;</span>
                                                                                      <span
                                                                                          style="font-family:Tahoma, Geneva, sans-serif;font-size:14.0px;font-style:normal;line-height:16px;font-weight:normal;color:#8b8b8b;display:inline;">Software
                                                                                          developer&nbsp;</span></td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td
                                                                                      style="border-collapse:collapse;padding-bottom:1px;height:1px;">
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td>
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                                          <tbody>
                                                              <tr>
                                                                  <td>
                                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td
                                                                                      style="border-collapse:collapse;font-family:Tahoma, Geneva, sans-serif;font-size:14.0px;font-style:normal;line-height:16px;font-weight:normal;">
                                                                                      <span
                                                                                          style="font-family:Tahoma, Geneva, sans-serif;font-size:14.0px;font-style:normal;line-height:16px;font-weight:normal;color:#8b8b8b;display:inline;">Gareth-Clifford.web.app</span>
                                                                                  </td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td
                                                                                      style="border-collapse:collapse;padding-bottom:1px;height:1px;">
                                                                                  </td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td
                                                                                      style="border-collapse:collapse;padding-bottom:3px;height:3px;">
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td>
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                                          <tbody>
                                                              <tr>
                                                                  <td>
                                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                                          style="font-family:Arial,Helvetica,sans-serif;line-height:0px;font-size:1px;padding:0px;border-spacing:0px;margin:0px;border-collapse:collapse;">
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td><a style="font-size: 0px; line-height: 0px;"
                                                                                          target="_blank" rel="nofollow"
                                                                                          href="https://github.com/GarethClifford"><img
                                                                                              height="24" width="24"
                                                                                              alt="github" border="0"
                                                                                              src="https://r8g4u6u5.stackpathcdn.com/assets/social/24/native/03github.gif"></a>
                                                                                  </td>
                                                                                  <td
                                                                                      style="border-collapse:collapse;padding-right:5px;width:5px;">
                                                                                  </td>
                                                                                  <td><a style="font-size: 0px; line-height: 0px;"
                                                                                          target="_blank" rel="nofollow"
                                                                                          href="https://www.instagram.com/garethclifford/"><img
                                                                                              height="24" width="24"
                                                                                              alt="instagram" border="0"
                                                                                              src="https://r8g4u6u5.stackpathcdn.com/assets/social/24/native/03instagram.gif"></a>
                                                                                  </td>
                                                                                  <td
                                                                                      style="border-collapse:collapse;padding-right:5px;width:5px;">
                                                                                  </td>
                                                                                  <td><a style="font-size: 0px; line-height: 0px;"
                                                                                          target="_blank" rel="nofollow"
                                                                                          href="https://www.linkedin.com/in/gareth-clifford-397625153/"><img
                                                                                              height="24" width="24"
                                                                                              alt="linkedin" border="0"
                                                                                              src="https://r8g4u6u5.stackpathcdn.com/assets/social/24/native/03linkedin.gif"></a>
                                                                                  </td>
                                                                                  <td></td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td
                                                                                      style="border-collapse:collapse;padding-bottom:4px;height:4px;">
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
              <tr>
                  <td style="border-collapse:collapse;padding-bottom:8px;height:8px;"></td>
              </tr>
          </tbody>
      </table>
  `;
}

var message = {
    from: config.user,
    to: config.sendingEmail,
    subject: config.defaultSubject + new Date().toDateString(),
    html: '',
    amp: ''
};


function CustomError(status, errorType, msg) {
    Error.call(this);

    this.message = msg;
    this.status = status;
    this.name = errorType;
};
CustomError.prototype.__proto__ = Error.prototype;