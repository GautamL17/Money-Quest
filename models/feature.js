import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: true
    },
    description: {
        type: String, required: true
    },
    icon: {
        type: String
    },
    route: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const Feature = mongoose.model('Feature', featureSchema);
export default Feature;