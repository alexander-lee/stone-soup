import mongoose from 'mongoose';
import twilio from 'twilio';
import client from '../models/client';

const twilioSid = 'AC8f4cf356a0edfd29bd5195a8a6b6b434';
const twilioAuth = 'fbe9692575d9ca7f7280b260ab04c321';
const twilioNum = '+15594613227';

const Schema = mongoose.Schema;

const Restaurant = new Schema({
  username: String,
  password: String,
  name: String,
  numberOfServings: Number,
  menu: [{ name: String, servings: Number }],
  location: String,
  pickupTimes: [{ startDate: String, endDate: String }],
  subscribedClients: [Schema.Types.ObjectId],
  dietaryRestrictions: {
    vegan: Boolean,
    peanut: Boolean,
    glutenfree: Boolean,
    milk: Boolean,
    egg: Boolean,
    seafood: Boolean
  }
}, {
  timestamps: true
});

Restaurant.statics.sendNotifications = (jobID, cb) => {
    restaurant
        .findOne({ _id: jobID })
        .then((restaurant) => {
            sendNotifications(restaurant);
        });

    function sendNotifications(restaurant) {
        const twiml = new twilio(twilioSid, twilioAuth);
        restaurant.subscribedClients.forEach(async (subscriberID) => {
          const subscriber = await client.findOne({ _id: subscriberID });
          const options = {
              to: subscriber.phoneNumber,
              from: twilioNum,
              body: `${restaurant.username} will be having their distribution time in half an hour! TODO ticket generation goes here`
          };

          twiml.messages.create(options, (err) => {
            if (err) {
              console.log(err);
            }
          });
        });
    }
}

const restaurant = mongoose.model('Restaurant', Restaurant);
export default restaurant;
