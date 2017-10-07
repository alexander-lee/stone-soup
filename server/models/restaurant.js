import mongoose from 'mongoose';
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

export default mongoose.model('Restaurant', Restaurant);
