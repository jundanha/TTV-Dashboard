import express from 'express';
import dbConnection from './config/dbconnection.js';
import patientRoutes from './routes/patientRoutes.js';
import ttvRoutes from './routes/ttvRoutes.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

await dbConnection();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/patient', patientRoutes);
app.use('/ttv', ttvRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

