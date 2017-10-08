import express from 'express';
import session from 'express-session';
import twilio from 'twilio';
import { Restaurant, Client } from '../models';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import cloudinary from 'cloudinary';
import config from '../config/config';

cloudinary.config(config['cloudinary']);

const router = express.Router();
router.use(session({ secret: 'stone-soup'}));

router.post('/fake', async (req, res) => {
  const str = 'data:image/png;base64,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';
  cloudinary.v2.uploader.upload(str, (err, result) => {
    console.log(result);
  });
});


router.post('/register', async (req, res) => {
  const responder = new twilio.twiml.MessagingResponse();

  // try to find this client's phone number in the database
  const client = await Client.findOne({ phoneNumber: req.body.From });
  const state = req.session.state ? req.session.state : 'unregistered';

  /* EXPERIEMNTAL */
  if (req.body.Body === 'erase') {
    req.session.destroy();
    console.log('destroyed');
    res.sendStatus(200);
  }

  // branch based off of current state
  if (state === 'unregistered') {
    responder.message('Welcome to Stone Soup! Start registering by providing your zipcode!');
    req.session.state = 'zip';
  } else if (state === 'zip') {
    const zipcode = req.body.Body.trim();
    if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcode)) {
      req.session.zipcode = zipcode;
      req.session.state = 'restrictions';
      responder.message('Do you have any dietary restrictions?\n0: None\n1: Vegan\n2: Gluten Free\n3: Peanut/Soy\n4: Milk\n5: Eggs\n6: Seafood\nIf you have multiple, enter the numbers with commas in between (e.g. 1,2,3)');
    } else {
      responder.message('Invalid zipcode. Please try again!');
    }
  } else if (state === 'restrictions') {
    const body = req.body.Body.trim().split(',');
    const restrictions = {
      vegan: false,
      peanut: false,
      glutenfree: false,
      milk: false,
      egg: false,
      seafood: false
    };

    for (let restr of body) {
      // its dirty af, but i had to do this :(
      if (restr === '0') { break; }
      if (restr === '1') { restrictions.vegan = true; }
      if (restr === '2') { restrictions.glutenfree = true; }
      if (restr === '3') { restrictions.peanut = true; }
      if (restr === '4') { restrictions.milk = true; }
      if (restr === '5') { restrictions.egg = true; }
      if (restr === '6') { restrictions.seafood = true; }
    }

    // find restaurants that meet the user's criteria
    let response = '';
    req.session.mapping = {};
    await fetch(`https://www.zipcodeapi.com/rest/XqLRqZCjj25C2WlIMG4hWxFzbvBzZjIWJuOatqtNtzqwvLeirjznRfW2KyBKRkHB/radius.json/${req.session.zipcode}/5/km?minimal`)
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        const nearbyRestaurants = await Restaurant.find({
          location: { $in: data.zip_codes },
          'dietaryRestrictions.vegan': restrictions.vegan,
          'dietaryRestrictions.glutenfree': restrictions.glutenfree,
          'dietaryRestrictions.peanut': restrictions.peanut,
          'dietaryRestrictions.milk': restrictions.milk,
          'dietaryRestrictions.egg': restrictions.egg,
          'dietaryRestrictions.seafood': restrictions.seafood
        });

        // send a message with the nearbyRestaurants (and zipcode) back!
        response = "Here's a list of restaurants that meet your criteria. Please respond with the restaurants that you're interested in subscribing to!\n\n";
        for (let restr in nearbyRestaurants) {
          req.session.mapping[parseInt(restr) + 1] = nearbyRestaurants[restr]._id;
          response += ((parseInt(restr) + 1) + `) ${nearbyRestaurants[restr].name}\n` + `(${nearbyRestaurants[restr].location})`);
        }
      });
    req.session.state = 'register';
    responder.message(response);
  } else if (state === 'register') {
    const body = req.body.Body.trim().split(',');

    // fill out client data for this client
    const data = {
      phoneNumber: req.body.From,
      zipcode: req.session.zipcode,
      ticketGiven: false,
      subscribedRestaurants: []
    };
    for (let restr of body) {
      data.subscribedRestaurants.push(req.session.mapping[restr]);
    }

    // save client to db
    const newClient = new Client(data);
    await newClient.save();

    // now add this client's _id to each restaurant he/she has subbed to
    const restrs = await Restaurant.find({
      _id: { $in: _.values(req.session.mapping) }
    });
    restrs.forEach(async (restr) => {
      restr.subscribedClients.push(newClient._id);
      await restr.save();
    });

    responder.message("Congratulations! You've been registered for Stone Soup. You will receive a text when a restaurant you have chosen opens for food-pickup.");
  }

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(responder.toString());
});



export default router;
