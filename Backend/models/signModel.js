import mongoose from "mongoose";

const signSchema = new mongoose.Schema({
    gloss: { 
        type: String, 
        required: true 
    },
     // e.g., "HELLO"
    language: { 
        type: String, 
        default: 'ISL' 
    },
     // Indian Sign Language (default)
    mediaType: { 
        type: String, 
        enum: ['video', 'image'], 
        default: 'video' 
    },
    mediaUrl: { 
        type: String, 
        required: true 
    }, 
    description: { 
        type: String 
    },
    difficulty: { 
        type: String, 
        enum: ['easy', 'medium', 'hard'], 
        default: 'easy' 
    },
    tags: [{ 
        type: String
    }],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
  },
  { timestamps: true }
);

signSchema.index({ gloss: 1 }); 
signSchema.index({ tags: 1 });

const signModel = mongoose.model("Sign", signSchema);

export default signModel;