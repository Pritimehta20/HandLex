import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true,
    },
    passwordHash: {
        type: String,
        required: [true, "Please provide password"],
    },
    status : {
        type : String,
        enum : ["Active","Inactive","Suspended"],
        default : "Active"
    },
    bookmarkedSigns: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Sign" 
    }],
  completedLessons: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Lesson" 
}],
    preferredLanguage: { 
        type: String, 
        enum: ['en', 'hi'], 
        default: 'en' 
    },

}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

const userModel = mongoose.model("User", userSchema);

export default userModel;