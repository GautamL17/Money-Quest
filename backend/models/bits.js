import mongoose from "mongoose";

const bitsSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    topic: { type: String, required: true },
    content: { type: String, required: true, maxLength: 2000 },
    category: {
        type: String,
        enum: ['budgeting', 'saving', 'investing', 'credit', 'debit', 'general'],
        default: 'general'
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    language: { type: String, default: 'en' },
    createdBy: { type: String, default: 'Blogs Team' },
    quiz: [{
        question: String,
        options: [String],
        answer: String
    }]
}, { timestamps: true });

export default mongoose.model('Bit',bitsSchema);