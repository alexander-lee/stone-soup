import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Client = new Schema({
  phoneNumber: String,
  zipcode: String,
  subscribedRestaurants: [Schema.Types.ObjectId]
}, {
  timestamps: true
});

export default mongoose.model('Client', Client);
