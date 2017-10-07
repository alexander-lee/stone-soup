import express from 'express';
import bcrypt from 'bcryptjs';
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
    };
    const newRestaurant = new Restaurant(data);
    await newRestaurant.save();

    res.status(200).send({
      restaurant: newRestaurant
    });
  } catch (error) {
    res.status(400).send({
      error
    });
  }
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

      for (let day of body.pickupTimes) {
        for (let interval of day) {
          if (!interval.hasOwnProperty('startDate') || !interval.hasOwnProperty('endDate')) {
            throw new Error('pickupTimes needs to have intervals with startDate and endDate');
          }
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
        restaurant[key] = body[key];
      }
    }

    // Update dietaryRestrictions separately
    if (body.hasOwnProperty('dietaryRestrictions')) {
      for (let restriction of body.dietaryRestrictions) {
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

export default router;
