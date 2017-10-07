import express from 'express';
import { Restaurant } from '../models';

const router = express.Router();

const uneditableKeys = ['_id', 'username', 'password', 'createdAt', 'updatedAt', 'dietaryRestrictions'];
const dietaryRestrictions = Object.keys(Restaurant.schema.tree.dietaryRestrictions);

/*
  Request Body: {
    location: String,
    menu: [{}]
    pickupTimes: [[{}]],
  }
*/
router.put('/edit/:id', async (req, res) => {
  const properties = Object.keys(Restaurant.schema.tree)
    .filter((key) => !uneditableKeys.includes(key));
  const body = req.body;

  try {
    // Error Handling
    if (body.hasOwnProperty('pickupTimes')) {
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
    }

    if (body.hasOwnProperty('menu')) {
      for (item of body.menu) {
        if (!item.hasOwnProperty('name') || !item.hasOwnProperty('servings')) {
          throw new Error('menu needs to have items with name and servings');
        }
      }
    }

    const restaurant = await Restaurant.findById(req.params.id);

    for (key of properties) {
      if (body.hasOwnProperty(key)) {
        restaurant[key] = body[key];
      }
    }

    // Update dietaryRestrictions separately
    if (body.hasOwnProperty('dietaryRestrictions')) {
      for (restriction of body.dietaryRestrictions) {
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
  }
  catch (error) {
    res.status(400).send({
      error
    });
  }
});

export default router;
