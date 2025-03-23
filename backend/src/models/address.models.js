import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  placeString: {
    type: String,
    required: true
  },
  location: {
    ltd: {
      type: String,
      required: true
    },
    lng: {
      type: String,
      required: true
    }
  },
  placeId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});


const Address = mongoose.model('Address', addressSchema);

export default Address;
