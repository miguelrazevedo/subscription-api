import { loginZodSchema, registerZodSchema } from '../utils/zod.js';

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
