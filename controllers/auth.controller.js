/**
 *
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} ExpressNextFunction
 */

import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../utils/jwt.js';
import TokenExpiredError from 'jsonwebtoken';

// Using try-catches to use express' error handling

/**
 * POST /sign-up
 *
 * Creates a user in the database and hashes the user's password.
 * It also creates a Database session in
 * order to make a transaction when creating the user.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
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
        session.endSession();

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

/**
 *
 * POST /sign-in
 *
 * Sign In function. Verifies if the users exists and compares
 * the hashed password. At the end, a refresh token is set as a httpCookie
 * and the access token is sent in the response's body.
 * Throws an error in case the user is not found or the credentials
 * are invalid.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
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
            success: true,
            message: 'User signed in successfully',
            data: {
                accessToken,
                user: {
                    name: user.name,
                    email: user.email,
                    id: user._id,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /sign-out
 *
 * Sign out function. Logs out the user by clearing the refresh token
 * cookie. If the cookie is not found, throws a ``400`` HTTP status code
 * as the user is not signed in.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const signOut = async (req, res, next) => {
    try {
        if (req.cookies.refreshToken) {
            res.clearCookie('refreshToken');
            return res.status(200).json({
                success: true,
                message: 'User signed out successfully',
            });
        }
        const err = new Error('User is not signed in');
        err.statusCode = 400;
        throw err;
    } catch (error) {
        next(error);
    }
};

/**
 *
 * GET /access-token
 *
 * Gets a new Access Token. If the refresh token is not in the cookies
 * throws an Error alerting the user is not logged in, with a ``400`` HTTP status code.
 * Also if the token is invalid or expired, a ``401`` is thrown.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const getNewAccessToken = async (req, res, next) => {
    try {
        let err = new Error('User is not signed in');
        err.statusCode = 400;

        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw err;
        }
        const { userId } = verifyRefreshToken(refreshToken);

        if (!userId) {
            err = new Error('Invalid refresh token');
            err.statusCode = 401;
            throw err;
        }

        const accessToken = generateAccessToken({ userId });

        res.status(200).json({
            success: true,
            message: 'Access Token generated successfully',
            data: {
                accessToken,
            },
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            const err = new Error('Refresh Token has expired. Login again');
            err.statusCode = 401;
            return next(err);
        }
        return next(error);
    }
};
