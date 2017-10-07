import express from 'express';
import twilio from 'twilio';

const router = express.Router();
const session = require('express-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
// const twilioSid = process.env.TWILIO_ACCOUNT_SID;
// const twilioAuth = process.env.TWILIO_ACCOUNT_TOKEN;

router.use(session({secret: 'not-secret-at-all'}));

router.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  const state = req.session.state ? req.session.state : (checkIfRegistered(req.body.From) ? 'menu' : 'unregistered');
  console.log(state);

  switch(state) {
    case 'unregistered':
      twiml.message('Welcome to Stone Soup! Complete your registration by providing us with a little more information. What\'s your zip code?');
      req.session.state = 'zip';
      break;
    case 'zip':
      // const zip = req.body.something
      // validate(zipcode)
      twiml.message('Do you have any dietary restrictions?\n1: Vegetarian\n2: Diabetic\n3: Peanut/Soy Allergies');
      req.session.state = 'dietary_restrictions';
      break;
    case 'dietary_restrictions':
      // dietary restrictions locked to account
      twiml.message('Great! You\'ve completed registration!')
      req.session.state = 'menu';
      break;
    case 'menu':
      // some function to generate menu based on user settings here
      twiml.message('Today\'s Menu:\n1) A\n2) B\n3) C\n4) D\n5) E');
    default:
      break;
  }


  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

function checkIfRegistered(number) {
  return false;
}

export default router;
