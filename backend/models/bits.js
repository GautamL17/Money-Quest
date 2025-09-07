import mongoose from "mongoose";

const bitsSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true,
        maxLength: 100
    },
    topic: { 
        type: String, 
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['budgeting', 'saving', 'investing', 'credit', 'debit', 'general'],
        default: 'general',
        required: true
    },
    language: { 
        type: String, 
        default: 'en'
    },
    createdBy: { 
        type: String, 
        default: 'AI Generator' 
    },
    
    // This will contain all three difficulty levels
    levels: {
        basic: {
            content: {
                type: String,
                required: true,
                maxLength: 2000
            },
            quiz: {
                type: [{
                    question: { 
                        type: String, 
                        required: true,
                        maxLength: 300
                    },
                    options: {
                        type: [String],
                        required: true,
                        validate: {
                            validator: function(v) {
                                return v.length === 4;
                            },
                            message: 'Quiz must have exactly 4 options'
                        }
                    },
                    answer: { 
                        type: String, 
                        required: true,
                        validate: {
                            validator: function(v) {
                                return this.options.includes(v);
                            },
                            message: 'Answer must be one of the options'
                        }
                    },
                    explanations: { 
                        type: Map, 
                        of: String,
                        required: true
                    }
                }],
                validate: {
                    validator: function(v) {
                        return v.length === 5;
                    },
                    message: 'Basic level must have exactly 5 questions'
                },
                required: true
            }
        },
        intermediate: {
            content: {
                type: String,
                required: true,
                maxLength: 2000
            },
            quiz: {
                type: [{
                    question: { 
                        type: String, 
                        required: true,
                        maxLength: 300
                    },
                    options: {
                        type: [String],
                        required: true,
                        validate: {
                            validator: function(v) {
                                return v.length === 4;
                            },
                            message: 'Quiz must have exactly 4 options'
                        }
                    },
                    answer: { 
                        type: String, 
                        required: true,
                        validate: {
                            validator: function(v) {
                                return this.options.includes(v);
                            },
                            message: 'Answer must be one of the options'
                        }
                    },
                    explanations: { 
                        type: Map, 
                        of: String,
                        required: true
                    }
                }],
                validate: {
                    validator: function(v) {
                        return v.length === 5;
                    },
                    message: 'Intermediate level must have exactly 5 questions'
                },
                required: true
            }
        },
        advanced: {
            content: {
                type: String,
                required: true,
                maxLength: 2000
            },
            quiz: {
                type: [{
                    question: { 
                        type: String, 
                        required: true,
                        maxLength: 300
                    },
                    options: {
                        type: [String],
                        required: true,
                        validate: {
                            validator: function(v) {
                                return v.length === 4;
                            },
                            message: 'Quiz must have exactly 4 options'
                        }
                    },
                    answer: { 
                        type: String, 
                        required: true,
                        validate: {
                            validator: function(v) {
                                return this.options.includes(v);
                            },
                            message: 'Answer must be one of the options'
                        }
                    },
                    explanations: { 
                        type: Map, 
                        of: String,
                        required: true
                    }
                }],
                validate: {
                    validator: function(v) {
                        return v.length === 5;
                    },
                    message: 'Advanced level must have exactly 5 questions'
                },
                required: true
            }
        }
    },

    // User progress tracking
    userProgress: {
        basic: {
            completed: { type: Boolean, default: false },
            score: { type: Number, default: 0 },
            answeredQuestions: [{ type: Number }], // Array of question indices answered correctly
            completedAt: { type: Date }
        },
        intermediate: {
            unlocked: { type: Boolean, default: false },
            completed: { type: Boolean, default: false },
            score: { type: Number, default: 0 },
            answeredQuestions: [{ type: Number }],
            completedAt: { type: Date }
        },
        advanced: {
            unlocked: { type: Boolean, default: false },
            completed: { type: Boolean, default: false },
            score: { type: Number, default: 0 },
            answeredQuestions: [{ type: Number }],
            completedAt: { type: Date }
        }
    },
    
    // Metadata
    tags: {
        type: [String],
        default: []
    },
    estimatedReadTime: {
        type: Number, // in minutes for all levels combined
        default: 10
    },
    
    // Overall stats
    stats: {
        totalViews: { type: Number, default: 0 },
        totalCompletions: { type: Number, default: 0 }, // Users who completed all levels
        averageCompletionTime: { type: Number, default: 0 }, // in minutes
        difficultyCompletionRates: {
            basic: { type: Number, default: 0 },
            intermediate: { type: Number, default: 0 },
            advanced: { type: Number, default: 0 }
        }
    },
    
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true
});

// Methods to check if levels are unlocked
bitsSchema.methods.isIntermediateUnlocked = function() {
    return this.userProgress?.basic?.completed || false;
};

bitsSchema.methods.isAdvancedUnlocked = function() {
    return (this.userProgress?.basic?.completed || false) && 
           (this.userProgress?.intermediate?.completed || false);
};

// Enhanced method to update user progress
bitsSchema.methods.updateProgress = async function(level, questionIndex, isCorrect) {
  if (!this.userProgress[level].answeredQuestions.includes(questionIndex)) {
    this.userProgress[level].answeredQuestions.push(questionIndex);
    if (isCorrect) this.userProgress[level].score += 1;
    if (this.userProgress[level].answeredQuestions.length === 5) {
      this.userProgress[level].completed = true;
      if (level === 'basic') this.userProgress.intermediate.unlocked = true;
      if (level === 'intermediate') this.userProgress.advanced.unlocked = true;
    }
    await this.save();
  }
};

// Method to get overall completion percentage
bitsSchema.methods.getOverallCompletion = function() {
    if (!this.userProgress) return 0;
    
    const basicScore = this.userProgress.basic?.score || 0;
    const intermediateScore = this.userProgress.intermediate?.score || 0;
    const advancedScore = this.userProgress.advanced?.score || 0;
    
    return Math.round((basicScore + intermediateScore + advancedScore) / 3);
};

// Method to get total questions answered across all levels
bitsSchema.methods.getTotalQuestionsAnswered = function() {
    if (!this.userProgress) return 0;
    
    const basicAnswered = this.userProgress.basic?.answeredQuestions?.length || 0;
    const intermediateAnswered = this.userProgress.intermediate?.answeredQuestions?.length || 0;
    const advancedAnswered = this.userProgress.advanced?.answeredQuestions?.length || 0;
    
    return basicAnswered + intermediateAnswered + advancedAnswered;
};

// Method to check if all levels are completed
bitsSchema.methods.isFullyCompleted = function() {
    if (!this.userProgress) return false;
    
    return (this.userProgress.basic?.completed || false) &&
           (this.userProgress.intermediate?.completed || false) &&
           (this.userProgress.advanced?.completed || false);
};

// Static method to find bits by completion status
bitsSchema.statics.findByCompletionStatus = function(completed = true) {
    const matchCondition = completed 
        ? { 'userProgress.basic.completed': true, 'userProgress.intermediate.completed': true, 'userProgress.advanced.completed': true }
        : { $or: [
            { 'userProgress.basic.completed': { $ne: true } },
            { 'userProgress.intermediate.completed': { $ne: true } },
            { 'userProgress.advanced.completed': { $ne: true } }
          ]};
    
    return this.find(matchCondition);
};

export default mongoose.model('Bit', bitsSchema);