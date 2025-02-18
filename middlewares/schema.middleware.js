/**
 *
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} ExpressNextFunction
 */

import { createSubscriptionZodSchema } from '../utils/zod.js';

/**
 *
 * Verifies the request's body against the ``loginZodSchema`` as well as
 * the minimum requirements. Throws a ``400`` HTTP status code
 * if the conditions are not met.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const signInSchemaMiddleware = (req, res, next) => {
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

/**
 *
 * Verifies the request's body against the ``registerZodSchema`` as well as
 * the minimum requirements. Throws a ``400`` HTTP status code
 * if the conditions are not met.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
export const signUpSchemaMiddleware = (req, res, next) => {
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

/**
 *
 * Verifies the request's body against the ``createSubscriptionZodSchema`` as well as
 * the minimum requirements. Throws a ``400`` HTTP status code
 * if the conditions are not met.
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */

export const createSubscriptionMiddleware = (req, res, next) => {
    try {
        const parsed = createSubscriptionZodSchema.safeParse(req.body);
        if (!parsed.success) {
            // At this point, an error should be thrown
            // Verify what caused the error and throw it
            let err = new Error(
                `${parsed.error.issues[0].message} (${parsed.error.issues[0].path[0]})`
            );
            err.statusCode = 400;
            throw err;
        }
        next();
    } catch (error) {
        next(error);
    }
};
