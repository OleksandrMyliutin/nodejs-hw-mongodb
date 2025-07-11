import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
  name: String,
  email: String,
  phoneNumber: String,
  contactType: String,
  isFavourite: Boolean,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  photo: {
  type: String,
  default: '',
  }
});


export const Contact = model('Contact', contactSchema);
