import express from 'express';
import bcrypt from 'bcryptjs';
import { Restaurant } from '../models';

const SALT_WORK_FACTOR = 10;
const router = express.Router();

/*
  Request Body: {
    username: String,
    password: String,  
  }
*/
router.post('/create', async (req, res) => {
  const body = req.body;

  try {
    // check if username already exists
    const restaurant = await Restaurant.find({ username: body.username });
    if (restaurant) {
      throw new Error('A restaurant with this username already exists!');
    }

    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    const newRestaurant = {
      username: body.username,
      password: bcrypt.hashSync(body.password, salt);
    };
    await newRestaurant.save();

    res.status(200).send({
      newRestaurant
    });
  }
  catch (error) {
    res.status(400).send({
      error
    });
  }
});

/*
  Request Body: {
    location: String,
    pickupTimes: [[{}]],
  }
*/
router.put('/edit/:id', async (req, res) => {
  const body = req.body;

  try {
    // Error Handling
    if (body.pickupTimes.length !== 7) {
      throw new Error('pickupTimes needs to have 7 entries');
    }

    for (day of body.pickupTimes) {
      for (interval of day) {
        if (!interval.hasOwnProperty('startDate') || !interval.hasOwnProperty('endDate')) {
          throw new Error('pickupTimes needs to have intervals with startDate and endDate');
        }
      }
    }

    const restaurant = await Restaurant.findById(req.params.id);
    restaurant.location = body.location;
    restaurant.pickupTimes = body.pickupTimes;
    await restaurant.save();

    res.status(200).send({
      restaurant
    });
  }
  catch (error) {
    res.status(400).send({
      error
    });
  }
});

export default router;
