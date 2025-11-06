import mongoose from "mongoose";
let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
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
    }
});

export default mongoose.model("User", userSchema);