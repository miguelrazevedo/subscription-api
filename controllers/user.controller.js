/**
 *
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} ExpressNextFunction
 */

import mongoose from 'mongoose';
import User from '../models/user.model.js';

/**
 *
 * All these routes are protected by the authorizeMiddleware
 */

/**
 * GET /
 * Gets all users
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');

        res.json({ success: true, message: 'Users found', data: users });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /:id
 * Returns a user by a specified Id in the params
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.json({ success: true, message: 'User found', data: user });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /:id
 * Update a user by a specified Id in the params
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const updateUserById = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const { name, email } = req.user;

        const user = await User.findByIdAndUpdate(
            id,
            { name, email },
            {
                session,
            }
        ).select('-password');

        if (!user) {
            const err = new Error('User does not exist');
            err.statusCode = 404;
            throw err;
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'User update successfully',
            data: { user },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

/**
 * DELETE /:id
 * DELETE a user by a specified Id in the params
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const deleteUserById = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    // User can only delete himself
    try {
        const { id } = req.params;
        if (id !== req.user.id) {
            const err = new Error('User can only delete himself');
            err.statusCode = 401;
            throw err;
        }

        const user = await User.findOneAndDelete(id);

        if (!user) {
            const err = new Error('User does not exist');
            err.statusCode = 404;
            throw err;
        }

        // Sign out the user
        res.clearCookie('refreshToken');

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
