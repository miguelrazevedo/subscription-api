/**
 *
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} ExpressNextFunction
 */

import mongoose from 'mongoose';
import Subscription from '../models/subscription.model.js';

/** POST /
 * Creates a new subscription for the logged in user.
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
            data: { subscription: subscription[0] },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

/** GET /user/:id
 *  Returns all subscriptions of a user.
 *  A user can only get their own subscription
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const getUserSubscriptions = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.id !== req.params.id) {
            const error = new Error(
                'Unauthorized. You can only get your own subscriptions.'
            );
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: { subscriptions } });
    } catch (error) {
        next(error);
    }
};

/** GET /
 *  Returns all subscriptions
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json({
            success: true,
            message: 'Subscriptions found',
            data: { subscriptions },
        });
    } catch (error) {
        next(error);
    }
};

/** GET /:id
 *  Returns a subscription by specified Id in the params
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const getSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: 'Subscription found',
            data: { subscription },
        });
    } catch (error) {
        next(error);
    }
};

/** PUT /:id
 * UPDATE a subscription by a specified Id in the params
 * Only the user specified in the subscription can update it
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const updateSubscription = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = req.user;

        const subscription = await Subscription.findOneAndUpdate(
            { user: user.id, _id: req.params.id },
            { ...req.body },
            { session }
        );

        if (!subscription) {
            const err = new Error('Subscription not found.');
            err.statusCode = 404;
            throw err;
        }

        await session.commitTransaction();
        session.endSession();

        // Return the subscription updated
        const newSub = await Subscription.findOne({
            user: user.id,
            _id: req.params.id,
        });
        res.status(200).json({
            success: true,
            message: 'Subscription updated successfully',
            data: { subscription: newSub },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

/** DELETE /:id
 * DELETE a subscription by a specified Id in the params
 * Only the user specified in the subscription can delete it
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const deleteSubscription = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = req.user;

        const subscription = await Subscription.findOneAndDelete(
            { user: user.id, _id: req.params.id },
            { ...req.body },
            { session }
        );

        if (!subscription) {
            const err = new Error('Subscription not found.');
            err.statusCode = 404;
            throw err;
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Subscription deleted successfully',
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
