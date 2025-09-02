import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sendmail from  './routes/mail.js';
import db from './utils/db.js';

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use("/api/sendmail", sendmail);

app.listen(process.env.PORT || 5000, () => {
    db();
    console.log("Server running on port 5000");
});
