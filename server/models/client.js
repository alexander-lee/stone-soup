import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Client = new Schema({
  phoneNumber: String,
  zipcode: String,
  ticketGiven: Boolean,
  subscribedRestaurants: [Schema.Types.ObjectId]
}, {
  timestamps: true
});

const client = mongoose.model('Client', Client);
export default client;
