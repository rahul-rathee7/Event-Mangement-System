import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const Check_Cookie = async (req, res) => {
    let token = req.cookies.token;
      if(!token) {
          return res.status(401).json({success: false, message: "cookie required"})
      }

      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      return res.status(200).json({success: true, message: "data sucessfully fetched", user})
}

export const login_user = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(200).json({ success: false, message: "Missing required inputs" });
    }

    const CheckMail = await user.findOne({ email });
    if (!CheckMail) {
      return res.status(200).json({ success: false, message: "User not registered" });
    }

    const CheckPassword = await bcrypt.compare(password, CheckMail.password);
    if (!CheckPassword) {
      return res.status(200).json({ success: false, message: "Password doesn't match" });
    }

    const token = jwt.sign(
      { id: CheckMail._id, email: CheckMail.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false // set true in production
      })
      .status(200)
      .json({
        success: true,
        message: "User authorized",
        user: {
          id: CheckMail._id,
          email: CheckMail.email,
          fullname: CheckMail.fullname,
          description: CheckMail.description,
          location: CheckMail.location,
          image: CheckMail.image,
          role: CheckMail.role
        },
        token // add token to response
      });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const logout_user = (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
}