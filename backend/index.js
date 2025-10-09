import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sendmail from  './routes/mail.js';
import users from './routes/users.js';
import events from './routes/events.js';
// import { verifyToken } from './middlewares/Auth.js';
import cookieparser from 'cookie-parser'; 
import Auth from './routes/Auth.js'
import db from './utils/db.js';

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieparser());

app.use("/api/events", events);
app.use("/api/auth", Auth);
app.use("/api/sendmail", sendmail);
app.use("/api/users", users);
// app.use("/", verifyToken);

app.listen(process.env.PORT || 5000, () => {
    db();
    console.log("Server running on port 5000");
});
