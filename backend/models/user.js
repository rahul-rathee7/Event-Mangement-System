import mongoose from "mongoose";
let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
});

export default mongoose.model("User", userSchema);