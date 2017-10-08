import express from 'express';
import bcrypt from 'bcryptjs';
import qrcode from 'qrcode';
import shortcode from 'shortcode';
import twilio from 'twilio';
import _ from 'lodash';

import schedulerFactory from '../utils/scheduler';
import {
  Restaurant
} from '../models';

const router = express.Router();

const SALT_WORK_FACTOR = 10;
const uneditableKeys = ['_id', 'username', 'password', 'createdAt', 'updatedAt', 'dietaryRestrictions'];
const dietaryRestrictions = Object.keys(Restaurant.schema.tree.dietaryRestrictions);

/*
  Request Body: {
    username: String,
    password: String,
  }
*/
router.post('/create', async(req, res) => {
  const body = req.body;

  try {
    // check if username already exists
    const restaurant = await Restaurant.find({
      username: body.username
    });
    if (restaurant.length > 0) {
      throw new Error('A restaurant with this username already exists!');
    }

    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    const data = {
      username: body.username,
      password: bcrypt.hashSync(body.password, salt),
      name: body.name,
      validTickets: []
    };
    const newRestaurant = new Restaurant(data);
    await newRestaurant.save();

    res.status(200).send({
      restaurant: newRestaurant,
      redirectTo: '/restaurant/create'
    });
  } catch (error) {
    res.status(400).send({
      error: 'User already exists'
    });
  }
});

router.get('/menu/:id', async(req, res) => {
  let menu = null;
  const restaurant = await Restaurant.findById(req.params.id);
  menu = restaurant.menu;
  res.status(200).send({ menu });
});

/*
  Request Body: {
    location: String,
    menu: [{}]
    pickupTimes: [[{}]],
  }
*/
router.put('/edit/:id', async(req, res) => {
  const properties = Object.keys(Restaurant.schema.tree)
    .filter((key) => !uneditableKeys.includes(key));
  const body = req.body;
  try {
    // Error Handling
    if (body.hasOwnProperty('pickupTimes')) {
      if (body.pickupTimes.length !== 7) {
        throw new Error('pickupTimes needs to have 7 entries');
      }

      for (let interval in body.pickupTimes) {
        if (!body.pickupTimes[interval].hasOwnProperty('startDate') || !body.pickupTimes[interval].hasOwnProperty('endDate')) {
          throw new Error('pickupTimes needs to have intervals with startDate and endDate');
        } else {
      	  const scheduledAlert = schedulerFactory(body.pickupTimes[interval].startDate, interval, req.params.id);
      	  scheduledAlert.start();
      	}
      }
    }
    if (body.hasOwnProperty('menu')) {
      for (let item of body.menu) {
        if (!item.hasOwnProperty('name') || !item.hasOwnProperty('servings')) {
          throw new Error('menu needs to have items with name and servings');
        }
      }
    }
    const restaurant = await Restaurant.findById(req.params.id);
    for (let key of properties) {
      if (body.hasOwnProperty(key)) {
        restaurant[key] = _.cloneDeep(body[key]);
      }
    }

    // Update dietaryRestrictions separately
    if (body.hasOwnProperty('dietaryRestrictions')) {
      for (let restriction in body.dietaryRestrictions) {
        if (!dietaryRestrictions.includes(restriction)) {
          continue;
        }

        restaurant.dietaryRestrictions[restriction] = body.dietaryRestrictions[restriction];
      }
    }

    await restaurant.save();

    res.status(200).send({
      restaurant
    });
  } catch (error) {
    res.status(400).send({
      error: error.toString()
    });
  }
});

/*
  Request Body: {
    restaurantId: Number,
    menuItemId: Number,
    tokenId: Number
  }
*/
router.get('/validate/:restaurantId/:menuItemId/:tokenId', async (req, res) => {
  // get the restaurant corresponding to this restaurantId
  const restaurant = await Restaurant.findById(req.params.restaurantId);

  // does tokenId not exist in validTickets?
  console.log(restaurant);
  try {
    if (!restaurant.validTickets.includes(req.params.tokenId)) {
      throw new Error("Ticket has already been redeemed!");
    }
  }
  catch (error) {
    res.status(400).send({
      error: error.toString()
    });
  }

  // decrement the number of servings left for this specific menuItem
  const item = restaurant.menu.filter((food) => food._id == req.params.menuItemId);
  item[0].servings -= 1;

  // remove token id from validTickets
  // delete restaurant.validTickets[req.params.tokenId];
  restaurant.validTickets.splice(restaurant.validTickets.indexOf(req.params.tokenId), 1)

  await restaurant.save();
  res.status(200).send({
    restaurant
  });
});

export default router;
