import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

// Using try-catches to use express' error handling
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.user;

        const userExists = await User.findOne({ email });
        if (userExists) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // In order to pass a session, the first argument must be an array
        // even if we're only creating one document
        const users = await User.create(
            [{ name, email, password: hashedPassword }],
            { session }
        );

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: users[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.user;

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const refreshToken = generateRefreshToken({ userId: user._id });
        const accessToken = generateAccessToken({ userId: user._id });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 3600 * 24 * 7, // 7day
        });

        res.status(200).json({
            sucess: true,
            message: 'User signed in successfully',
            data: {
                accessToken,
                user: {
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};
