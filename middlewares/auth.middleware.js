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
const authorizeMiddleware = async (req, res, next) => {
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

export default authorizeMiddleware;
