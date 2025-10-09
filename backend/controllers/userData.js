import user from '../models/user.js';

export const users_data = async (req, res) => {
    const { email } = req.body;
    console.log(email);

    try {
        const User = await user.find({ email });
        console.log(User);

        if(!User){
            return res.status(400).json({ success: false, message: "No users found" });
        }

        return res.status(200).json({ success: true, User });
    } catch (error) {
        console.log(error);
    }
}

export const update_user_data = async (req, res) => {
    const { email, fullname, description, location } = req.body;

    try{
        if(!email){
            return res.status(400).json({ success: false, message: "Missing email" });
        }

        const existingUser = await user.findOne({ email });

        if(!existingUser){
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        await user.updateOne({ email }, { $set: { fullname, description, location } });

        return res.status(200).json({ success: true, message: "User data updated successfully" });
    }catch(err) {
        console.log(err);
    }
}