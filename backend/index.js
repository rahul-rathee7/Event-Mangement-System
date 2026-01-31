import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import sendmail from  './routes/mail.js';
import users from './routes/users.js';
import events from './routes/events.js';
// import { verifyToken } from './middlewares/Auth.js';
import cookieparser from 'cookie-parser'; 
import Auth from './routes/Auth.js'
import db from './utils/db.js';
import './config/passport.js'; // Passport configuration

dotenv.config();
const app = express();

// app.use((req, res, next) => {
//     console.log(req.method, req.url);
//     next();
// });

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:8081', 'https://event-mangement-system-one.vercel.app'], credentials: true }));
app.use(express.json());
app.use(cookieparser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/api/events", events);
app.use("/api/auth", Auth);
app.use("/api/sendmail", sendmail);
app.use("/api/users", users);

app.listen(process.env.PORT || 5000, () => {
    db();
    console.log("Server running on port 5000");
});
