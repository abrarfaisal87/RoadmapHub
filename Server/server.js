import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());//security middleware to help secure the app by setting various HTTP headers
app.use(morgan('dev'));


// importing all routes

app.use('/api/auth', authRoutes);        // user login/signup
app.use('/api/roadmap', roadmapRoutes);  // roadmap fetching + upvote
app.use('/api/comments', commentsRoutes); // comment system (add/edit/delete/replies)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// export default app;