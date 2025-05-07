import mongoose from 'mongoose';

const financerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  roi: {
    type: Number, // You can use Decimal128 if you need higher precision
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Financer', financerSchema);
