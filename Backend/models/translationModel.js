import mongoose from "mongoose";

const translationSchema = new mongoose.Schema({
    sign: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sign', 
        required: true 
    },
    direction: { 
        type: String, 
        enum: ['sign-to-text', 'text-to-sign'], 
        default: 'sign-to-text' 
    },
    textEn: { 
        type: String 
    }, 
    textHi: { 
        type: String 
    }, 
    exampleSentenceEn: { 
        type: String 
    },
    exampleSentenceHi: { 
        type: String 
    }
},
  { timestamps: true }
);

translationSchema.index({ textEn: "text", textHi: "text" });

const translationModel = mongoose.model("Translation", translationSchema);

export default translationModel;