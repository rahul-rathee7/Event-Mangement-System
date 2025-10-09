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
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    image: {
        type: String
    },
    role: {
        type: String
    }
});

export default mongoose.model("User", userSchema);