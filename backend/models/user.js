import mongoose from "mongoose";
let Schema = mongoose.Schema;

let userSchema = new Schema({
    googleId: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    fullname: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    phone: {
        type: Number
    },
    location: {
        type: String
    },
    image: {
        type: String
    },
    twoFA: {
        type: Boolean,
    },
    role: {
        type: String
    },
    register_event_id: {
        type: [String],
        default: []
    }
});

export default mongoose.model("User", userSchema);