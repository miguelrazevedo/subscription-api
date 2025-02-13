/**
 *
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} ExpressNextFunction
 */

import User from '../models/user.model.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { loginZodSchema, registerZodSchema } from '../utils/zod.js';

/**
 * Authorization Middleware. Verifies the Access token is in the ``Authorization``
 * header. Otherwise a ``401`` HTTP status code is thrown.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const authorizeMiddleware = async (req, res, next) => {
    try {
        const err = new Error('User not authorized');
        err.statusCode = 401;

        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw err;
        }

        const { userId } = verifyAccessToken(token);

        const user = await User.findById(userId);

        if (!user) {
            throw err;
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

/** Middleware.
 *
 * Verifies the request's body against a Schema as well as
 * the minimum requirements. Throws a ``400`` HTTP status code
 * if the conditions are not met.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const signUpMiddleware = (req, res, next) => {
    try {
        const parsed = registerZodSchema.safeParse(req.body);
        if (!parsed.success) {
            // At this point, an error should be thrown
            // Verify what caused the error and throw it
            let err = new Error(
                'Please make sure all fields were inserted correctly'
            );

            const issue = parsed.error.issues[0];
            if (issue.code === 'too_small') {
                if (issue.path[0] === 'name') {
                    err = new Error(`Name must be at least 6 characters long`);
                } else if (issue.path[0] === 'password') {
                    err = new Error(
                        `Password must be at least 6 characters long`
                    );
                }
            } else if (issue.code === 'invalid_string') {
                err = new Error(`A valid email must inserted`);
            }
            err.statusCode = 400;
            throw err;
        }

        req.user = parsed.data;
        next();
    } catch (error) {
        next(error);
    }
};

/** Middleware.
 *
 * Verifies the request's body against a Schema as well as
 * the minimum requirements. Throws a ``400`` HTTP status code
 * if the conditions are not met.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const signInMiddleware = (req, res, next) => {
    try {
        const parsed = loginZodSchema.safeParse(req.body);

        if (!parsed.success) {
            // At this point, an error should be thrown
            // Verify what caused the error and throw it
            let err = new Error(
                'Please make sure all fields were inserted correctly'
            );

            const issue = parsed.error.issues[0];
            if (issue.code === 'too_small' && issue.path[0] === 'password') {
                err = new Error(`Password must be at least 6 characters long`);
            } else if (issue.code === 'invalid_string') {
                err = new Error(`A valid email must inserted`);
            }

            err.statusCode = 400;
            throw err;
        }

        req.user = parsed.data;
        next();
    } catch (error) {
        next(error);
    }
};
