import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  password: String
});

export default mongoose.model('User', User);
