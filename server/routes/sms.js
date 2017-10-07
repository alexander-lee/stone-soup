import express from 'express';
import twilio from 'twilio';

const router = express.Router();

router.post('/register', function(req, res) {
  var twiml = new twilio.TwimlResponse();
  twiml.message('yo');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});
