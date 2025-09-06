import mongoose from 'mongoose';

const memeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    },
    caption:{
        type:String,
        trim: true,
    },
    createdBy:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        enum:['general','finance','budgeting','tax','stocks'],
        default:'general'
    },
    likes:{
        type:Number,
        default: 0
    },
    shares:{
        type:Number,
        default: 0,
    },
    isPublished:{
        type: Boolean,
        default: true,
    },
},{timestamps:true})

export default mongoose.model('Meme',memeSchema);