import mongoose from 'mongoose';
import twilio from 'twilio';
import { Client } from '../models';

const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuth = process.env.TWILIO_ACCOUNT_TOKEN;
const twilioNum = '+15594613227';

const Schema = mongoose.Schema;

const Restaurant = new Schema({
  username: String,
  password: String,
  name: String,
  numberOfServings: Number,
  menu: [{ name: String, servings: Number }],
  location: String,
  pickupTimes: [
    [
      {
        startDate: {
          type: String,
          validate: {
            isAsync: true,
            validator: (v, cb) => {
              setTimeout(() => {
                let dateRegex = /^([0-1]?[0-9]|2[0-3])(:[0-5][0-9])?$/;
                let msg = v + ' is not a valid phone number.';
                cb(dateRegex.test(v), msg);
              }, 5)
            },
            message: 'Default error message'
          },
          required: [true, 'Valid start to interval required']
        },
        endDate: {
          type: String,
          validate: {
            isAsync: true,
            validator: (v, cb) => {
              setTimeout(() => {
                let dateRegex = /^([0-1]?[0-9]|2[0-3])(:[0-5][0-9])?$/;
                let msg = v + ' is not a valid phone number.';
                cb(dateRegex.test(v), msg);
              }, 5)
            },
            message: 'Default error message'
          },
          required: [true, 'Valid start to interval required']
        },
      }
    ]
  ],
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

Restaurant.statics.sendNotifications = (cb) => {
    Restaurant
        .find()
        .then((restaurants) => {
            sendNotifications(restaurants);
        });

    function sendNotifications(restaurants) {
        const client = new Twilio(twilioSid, twilioAuth);
        restaurants.forEach((restaurant) => {
          restaurant.subcribedClients.forEach(async (subscriberID) => {
            const subscriber = await Client.findOne({ _id: subscriberID });
            const options = {
                to: subscriber.phoneNumber,
                from: twilioNum,
                body: `${restaurant.username} will be having their distribution time in half an hour! TODO ticket generation goes here`
            };

            client.messages.create(options, (err) => {
              if (err) {
                console.log(err);
              } else {
                let masked = subscriber.substr(0, subscriber.length - 5);
                masked += '*****';
                console.log(`Message sent to ${masked}`);
              }
            })
          });
        });
    }
}

export default mongoose.model('Restaurant', Restaurant);
