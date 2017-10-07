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
  const state = req.session.state ? req.session.state : (checkIfRegistered(req.body.From) ? 'menu_restaurants' : 'unregistered');

  switch(state) {
    case 'unregistered':
      twiml.message('Welcome to Stone Soup! Complete your registration by providing us with a little more information. What\'s your zip code?');
      req.session.state = 'zip';
      break;
    case 'zip':
      if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(req.body.Body.trim())) {
        req.session.zip = req.body.Body;
        twiml.message('Do you have any dietary restrictions?\n0: None\n1: Vegetarian\n2: Diabetic\n3: Peanut/Soy Allergies\nIf you have multiple, enter the numbers with commas in between (e.g. 1,2,3)');
        req.session.state = 'dietary_restrictions';
      } else {
        twiml.message('That wasn\'t a valid zip code, try again');
      }
      break;
    case 'dietary_restrictions':
      // TODO promises/async/await give me depression i just want to validate
      let restrictions = req.body.Body.split(',');
      let ans = validateDietaryRestrictions(restrictions);
      console.log('call', ans);
      if (ans) {
        console.log('ans', ans);
        twiml.message(
        'Here\'s a list of participating restaurants around your location. Choose 5 restaurants to subscribe to:\nLISTGOESHERE')
        req.session.state = 'subscribe';
      } else {
        console.log(ans);
        twiml.message('Invalid dietary restriction input, follow the format (\'1\', \'1,2,3\', \'0\')');
      }
      break;
    case 'subscribe':
      // if valid choices
      // some function to generate menu based on user settings here
      twiml.message('You\'re all set! Here\'s today\'s Menu:\n1) A\n2) B\n3) C\n4) D\n5) E');
      req.session.state = 'menu_items';
      break;
    case 'menu_restaurants':
      if (req.session.claimed) {
        twiml.message('You\'ve already claimed a ticket today, come again tomorrow!');
      } else {
        twiml.message('Today\'s Menu:\n1) A\n2) B\n3) C\n4) D\n5) E');
        req.session.state = 'menu_items';
      }
      break;
    case 'menu_items':
      // some work getting menu items based on phone number & restaurant choice
      twiml.message('menu items here'); // can go back from here
      req.session.state = 'order'
      break;
    case 'order':
      // if go back
      // req.session.state = 'menu_restaurants'
      // else
      // save restaurant & item for ticket gen
      twiml.message('Confirm your order for menu_item from restaurant (Y/N)');
      req.session.state = 'ticket';
      break;
    case 'ticket':
      // if Y
      const ticketCode = 's183dxY';
      twiml.message('Here\'s your unique food ticket code: ' + ticketCode);
      req.session.claimed = true;
      req.session.state = 'menu_restaurants';
      // function to consume a ticket from restaurant db
      // if N
      // twimlmessage('We\'ve cancelled this order! Text us again if you\'d like to start the process over');
      // req.session.state = 'menu_restaurants'
      break;
    default:
      break;
  }


  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

function checkIfRegistered(number) {
  return false;
}

function validateDietaryRestrictions(restrictions) {
  Promise.all(restrictions.map((restriction) => {
    return new Promise((resolve) => {
      resolve(!isNaN(restriction) && Number(restriction) < 4);
    });
  })).then((values) => {
    console.log('values', values);
  });
}

export default router;
