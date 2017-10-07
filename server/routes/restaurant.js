import express from 'express';
import Datastore from '@google-cloud/datastore'
import auth from '../config/auth';
import { Restaurant } from '../models';

const dataKind = 'Restaurant';
const db = Datastore({
  projectId: auth.google.clientID
});

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

    const key = db.key([dataKind, req.params.id]);
    const restaurant = await db.get(key);
    restaurant.location = body.location;
    restaurant.pickupTimes = body.pickupTimes;
    await db.save(restaurant);

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
