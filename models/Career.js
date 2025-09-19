import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema({
    jobtitle: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    jobtypes : {
        type: String,
        required: true
    },
    position : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tasks : {
        type: [String],
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
}, { timestamps: true });

const Career = mongoose.model("Career", CareerSchema);
export default Career;