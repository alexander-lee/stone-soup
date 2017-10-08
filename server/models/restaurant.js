import mongoose from 'mongoose';
import twilio from 'twilio';
import shortid from 'shortid';
import QRCode from 'qrcode';
import cloudinary from 'cloudinary';

import client from '../models/client';
import config from '../config/config';

const twilioSid = 'AC8f4cf356a0edfd29bd5195a8a6b6b434';
const twilioAuth = 'fbe9692575d9ca7f7280b260ab04c321';
const twilioNum = '+15594613227';
const credentials = config[process.env.NODE_ENV || 'development'];

const Schema = mongoose.Schema;

const Restaurant = new Schema({
  username: String,
  password: String,
  name: String,
  validTickets: [ String ],
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

    async function sendNotifications(restaurant) {

        const twiml = new twilio(twilioSid, twilioAuth);

        let baseUrl = `${credentials.host}/api/restaurant/validate/${restaurant._id}/`;
        let menuItems = [];
        restaurant.menu.map((item, index) => {
          for (let i = 0; i < item['servings']; ++i) {
            menuItems.push(baseUrl+item._id+'/');
          }
        });
        console.log(menuItems);

        // generate a filtered out set of clients
        const filteredClients = await restaurant.subscribedClients.filter(async (unfilteredSubscriberID) => {
          const subscriber = await client.findOne({ _id: unfilteredSubscriberID });
          return !(subscriber.ticketGiven);
        });


        await filteredClients.forEach(async (subscriberID) => {


          const subscriber = await client.findOne({ _id: subscriberID });
          // generate a ticket for this user
          if (subscriber.ticketGiven) return;
          subscriber.ticketGiven = true;
          await subscriber.save();
          // Generate short ID
          const guid = shortid.generate();
          restaurant.validTickets.push(guid);
          await restaurant.save();
          console.log(restaurant);
          const url = menuItems.pop() + guid;
          console.log(url);
          QRCode.toDataURL(url, (err, base64) => {
            cloudinary.v2.uploader.upload(base64, (err, result) => {
              const imageUrl = result.url;
              console.log(imageUrl);
              const options = {
                  to: subscriber.phoneNumber,
                  from: twilioNum,
                  body: `Here is a QR Code that can be used to redeem food at ${restaurant.name}. Come by in the next 30 minutes!`,
                  mediaUrl: imageUrl,
              };

              twiml.messages.create(options, async (err) => {
                if (err) {
                  console.log(err);
                }
                console.log('pls res', restaurant)
              });
            });
          });

          //await subscriber.save();

        });
    }
}

const restaurant = mongoose.model('Restaurant', Restaurant);
export default restaurant;
