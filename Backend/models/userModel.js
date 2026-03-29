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
        required: [function() {
            return !this.googleId;  // ✅ Required ONLY for non-Google users
        }, "Please provide password"]
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
    type: String,  // Storing lesson IDs as strings for flexibility
    ref: "Lesson" 
}],
    preferredLanguage: { 
        type: String, 
        enum: ['en', 'hi'], 
        default: 'en' 
    },
    resetOTP: {
        type: String,
        default: null
    },
    resetOTPExpires: {
        type: Date,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
     googleId: {  // ✅ NEW: For Google OAuth users
        type: String,
        unique: true,
        sparse: true,
        default: null
    }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export default userModel;