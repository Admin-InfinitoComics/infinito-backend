import mongoose from 'mongoose';

const TimelineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  eventDate: {
    type: Date
  },
  category:{
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 3000,
    trim: true
  },
  month:{
    type: String
  },
  year:{
    type:String
  },
  imageUrl: {
    type: String
  },
  eventNumber:{
    type: String,
    required: true
  }
});

export default mongoose.model('Timeline', TimelineSchema);
