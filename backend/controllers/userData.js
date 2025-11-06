import user from '../models/user.js';
import axios from 'axios';

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
    const { email, fullname, description, location, phone } = req.body;

    try{
        if(!email){
            return res.status(400).json({ success: false, message: "Missing email" });
        }

        const existingUser = await user.findOne({ email });

        if(!existingUser){
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        await user.updateOne({ email }, { $set: { fullname, description, location, phone } });

        return res.status(200).json({ success: true, message: "User data updated successfully", fullname, description, location, phone });
    }catch(err) {
        console.log(err);
    }
}

export const user_location = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 5
      },
      headers: {
        'User-Agent': 'EventManagementSystem/1.0'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
}