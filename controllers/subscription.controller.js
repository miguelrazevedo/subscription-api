/**
 *
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} ExpressNextFunction
 */

import mongoose from 'mongoose';
import Subscription from '../models/subscription.model.js';

/**
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const createSubscription = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const subscription = await Subscription.create(
            [{ ...req.body, user: req.user._id }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: {
                subscription: subscription[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
