import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
  knownAs: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    default: "Unknown"
  },
  birthDate: {
    type: Date,
    required: true
  },
  placeOfOrigin: {
    type: String,
    required: true
  },
  characteristics: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  weapon: [{
    type: String,
    default: ''
  }],
  capabilities: [{
    type: String
  }],
  powers: [{
    type: String
  }],
  height:{
    type: String,
    default : "NA"
  },
  weight:{
    type : String,
    default : "NA"
  },
  age :{ 
    type : Number
  },
  species:{
    type: String,
    default: "Unknown"
  },
  eyes :{
    type : String,
    default: "NA"
  },
  hair : {
    type : String,
    default: "NA"
  },
  limitations: [{
    type: String
  }],
  description: {
    type: String
  },
  creator :[{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }],
  group : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  family:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  friends:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  enemies:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  comicsAppearedIn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comic'
  }],
  storyLine: {
    text: { type: String, required: true },
    image: { type: String }
  },
  about : {
    type: String,
    required: true
  },
  origin: {
    text: { type: String, required: true },
    image: { type: String }
  },
  mainImageUrl: {
    type: String,
    required:true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  mainLandscapeImageUrl :{
    type: String,
    required: true
  },
  power1ImageUrl:{
    type: String,
    required: true 
  },
  power2ImageUrl:{
    type :String,
    required : true
  },
  power3ImageUrl:{
    type: String,
    required: true
  },
 


}, { timestamps: true });

export default mongoose.model('Character', CharacterSchema);
  