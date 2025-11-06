import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const createToken = (res, user) => {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false // set true in production
  })

  return token
}

export const checkCookie = async (req, res) => {
  try {
    const token = req.cookies?.token
    if (!token) {
      return res.status(401).json({ success: false, message: 'Cookie required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, message: 'Data fetched', user })
  } catch (err) {
    console.error(err)
    res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Missing required inputs' })

    const user = await User.findOne({ email })
    if (!user)
      return res.status(404).json({ success: false, message: 'User not registered' })

    const validPass = await bcrypt.compare(password, user.password)
    if (!validPass)
      return res.status(401).json({ success: false, message: 'Incorrect password' })

    const token = createToken(res, user)

    res.status(200).json({
      success: true,
      message: 'User authorized',
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        description: user.description,
        location: user.location,
        image: user.image,
        role: user.role,
        twoFA: user.twoFA,
        phone: user.phone
      },
      token
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const registerUser = async (req, res) => {
  try {
    const { email, password, fullname, role } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Missing required inputs' })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(409).json({ success: false, message: 'User already registered' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const userPng = "https://res.cloudinary.com/dgxwp0k8w/image/upload/v1760082438/user_vhcgsk.png"

    const newUser = await User.create({ email, password: hashedPassword, fullname, image:  userPng, role,  })

    const token = createToken(res, newUser)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
      token
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false // true in production
  })
  res.status(200).json({ success: true, message: 'Logged out successfully' })
}