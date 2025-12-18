import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    signs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sign' 
    }],
    level: { 
      type: String, 
      enum: ["beginner", "intermediate", "advanced"], 
      default: "beginner" 
    },
    category: { 
        type: String 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
  },
  { timestamps: true }
);

const lessonModel = mongoose.model("Lesson", lessonSchema);

export default lessonModel;

