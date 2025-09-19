import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    imageUrl:{
        type: String,
    },
    story:{
        type: String
    }
});

const BlogSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    subject: {
        required: true,
        type: String
    },
    authorName:{
        required : true,
        type:String
    },
    category:{
        required : true,
        type:String
    },
    news: [newsSchema],
    status: { 
        type: String, 
        enum: ['draft', 'published'], 
        default: 'draft' 
    },
}, {
    timestamps: true  
});

const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;