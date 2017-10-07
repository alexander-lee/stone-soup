import mongoose from 'mongoose';
import twilio from 'twilio';

const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuth = process.env.TWILIO_ACCOUNT_TOKEN;
const twilioNum = '+15594613227';

const Schema = mongoose.Schema;

const Restaurant = new Schema({
  username: String,
  password: String,
  numberOfServings: Number,
  menu: [{ name: String, servings: Number }],
  location: String,
  pickupTimes: [
    [{ startDate: Date, endDate: Date }]
  ],
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
        clients.forEach((restaurant) => {
          restaurant.subscribers.forEach((subscriber) => {
            const options = {
                to: subscriber,
                from: twilioNum,
                body: `${restaurant.username} will be having their distribution time in half an hour! TODO ticket generation goes here`
            };

            client.messages.create(options, (err, res) => {
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
