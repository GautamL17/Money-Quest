import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum:['admin', 'user'], default: 'user'},
    points: {
      type: Number,
      default: 0
    },
    rank: {
      type: String,
      default: "Rookie"
    },
    level: {
      type: Number,
      default: 1
    },
    // 👇 New field
    salary: {
      type: Number,
      default: 0,
    },
},{timestamps: true});

export default mongoose.model('User', userSchema);
