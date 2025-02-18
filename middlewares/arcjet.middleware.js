import aj from '../config/arcjet.js';

/**
 *
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} ExpressNextFunction
 */

/**
 * Arcjet middleware
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 */
const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 2 }); // Deduct 1 token from the bucket
        let err = new Error('Forbidden');
        err.statusCode = 403;

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                err = new Error('Too many requests. Rate limit exceeded');
                err.statusCode = 429;
            } else if (decision.reason.isBot()) {
                err = new Error('No bots allowed');
                err.statusCode = 403;
            }
            throw err;
        }
        next();
    } catch (error) {
        next(error);
    }
};

export default arcjetMiddleware;
