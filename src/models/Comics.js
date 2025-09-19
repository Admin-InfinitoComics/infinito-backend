import mongoose from "mongoose";

const comicChapSchema = new mongoose.Schema(
  {
    chapNum: {
      type: String
    },
    chapImage: {
      type: String
    },
    title: {
      type: String
    },
    releaseDate: {
      type: Date
    },
    chapPdf: {
      type: String
    },
  },
  { timestamps: true }
);

const comicSchema = mongoose.Schema({
    coverImg: {
        type: String,
        required: true
    },
    bannerImg: {
      type: String,
      required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    authors: {
        type: [String],
        required: true,
        validate: [arr => arr.length > 0, 'At least one author is required']
    },
    releasedYear: {
        type: Number,
        required: true
    },
    chapters: [comicChapSchema]
},
    { timestamps: true }
)

const Comic = mongoose.model("Comic", comicSchema);
export default Comic;