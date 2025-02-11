import express from 'express';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscriptions.routes.js';

import { PORT } from './config/env.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/subscriptions', subscriptionRouter);

// Error handling middleware - must be last - after other app.use()
app.use(errorMiddleware);

app.listen(PORT, async () => {
    console.log('Server running on port: ' + PORT);
    await connectDB();
});
