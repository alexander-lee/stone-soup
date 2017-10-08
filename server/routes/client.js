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

router.post('/register', async (req, res) => {
  const responder = new twilio.twiml.MessagingResponse();

  // try to find this client's phone number in the database
  const client = await Client.findOne({ phoneNumber: req.body.From });
  const state = req.session.state ? req.session.state : 'unregistered';

  /* EXPERIEMNTAL */
  if (req.body.Body.trim().toLowerCase() === 'erase') {
    // Go through restaurants
    const restaurants = await Restaurant.find({ subscribedClients: req.session.clientId });
    await restaurants.forEach(async (r) => {
      r.subscribedClients.splice(r.subscribedClients.indexOf(req.session.clientId), 1);
      await r.save();
    });

    req.session.destroy();
    console.log('destroyed');
    res.sendStatus(200);
    return;
  }
  if (req.body.Body.trim().toLowerCase().substring(0, 4) === 'info' && state === 'register') {
    const arr = req.body.Body.trim().split(' ');
    if (arr.length > 1) {
      const options = arr[1].split(',');
      let reponseString = '';
      for (let i = 0; i < options.length; ++i) {
        const restaurantId = req.session.mapping[options[i]];
        const restr = await Restaurant.findById(restaurantId);
        responseString += `The food options for ${restr.name} are:\n`;
        restr.menu.forEach((item, index) => {
          responseString += `${item.name}: ${item.servings}\n`;
        });
        responseString += '\n';
      }
      responder.message(responseString);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(responder.toString());
      return;
    }
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

    // Set restriction hash for current user
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
    await fetch(`https://www.zipcodeapi.com/rest/uKNbwxe3T8HdDiW2XCb4JxV6IsnWBid520hzyvCrEkEhCBkzdvEX3z3L1qIDJVJL/radius.json/${req.session.zipcode}/5/km?minimal`)
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        const nearbyRestaurants = await Restaurant.find({
          location: { $in: data.zip_codes },
        });


        const filteredRestaurants = [];
        for (let restaurant of nearbyRestaurants) {
          let add = true;
          for (let restriction in restrictions) {
            if (['vegan', 'glutenfree'].includes(restriction)) {
              // dietary restrictions
              if (restrictions[restriction] && !restaurant.dietaryRestrictions[restriction]) {
                add = false;
              }
            }
            else {
              // allergies
              if (restrictions[restriction] && restaurant.dietaryRestrictions[restriction]) {
                add = false;
              }
            }
          }

          if (add) {
            filteredRestaurants.push(restaurant);
          }
        }
        if (filteredRestaurants.length === 0) {
          response = "Unfortunately, we were unable to match you with a restaurant that meets your dietary needs. Please check back again tomorrow!";
          res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(responder.toString());
          return;
        }
        // send a message with the filteredRestaurants (and zipcode) back!
        response = "Here's a list of restaurants that meet your criteria. Please respond with the restaurants that you're interested in subscribing to!\n\n";
        for (let index in filteredRestaurants) {
          req.session.mapping[parseInt(index)] = filteredRestaurants[index]._id;
          response += ((parseInt(index) + 1) + `) ${filteredRestaurants[index].name}\n` + `(${filteredRestaurants[index].location})\n`);
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
    req.session.clientId = newClient._id;
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
