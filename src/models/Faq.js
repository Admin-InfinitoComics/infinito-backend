import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ['research', 'ultimate'],
    required: true
  }
}, { timestamps: true });

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;
