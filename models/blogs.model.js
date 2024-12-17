import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image1:{
        type:String
    },
    image2:{
        type:String
    }
},
    {
        timestamps: true
    }
);

export const Blog = mongoose.model("Blog", blogsSchema)