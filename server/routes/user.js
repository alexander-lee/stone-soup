import express from 'express';
import { Restaurant } from '../models';

const router = express.Router();

router.get('/api/user', async function(req, res) {
  let user = null;

  if(req.isAuthenticated() && req.session.hasOwnProperty('passport')) {
    const userId = req.session.passport.user;
    user = await Restaurant.findById(userId);
  }

  res.status(200).send({
    user: user
  });
});

export default router;
