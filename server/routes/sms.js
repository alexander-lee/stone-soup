import express from 'express';
import twilio from 'twilio';

const router = express.Router();
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuth = process.env.TWILIO_ACCOUNT_TOKEN;

router.post('/register', function(req, res) {
  console.log('hit');
  /*
  var twilio = twilio(twilioSid, twilioAuth);
  var twiml = new twilio.TwimlResponse();
  twiml.message('yo');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  */
  res.StatusCode(200);
});

export default router;
