import express from 'express';
import { Restaurant } from '../models';

const router = express.Router();

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
