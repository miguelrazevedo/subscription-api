import { Router } from 'express';
import {
    getNewAccessToken,
    signIn,
    signOut,
    signUp,
} from '../controllers/auth.controller.js';
import {
    signInSchemaMiddleware,
    signUpSchemaMiddleware,
} from '../middlewares/schema.middleware.js';

const authRouter = Router();

/**
 *
 * /api/auth
 *
 */

authRouter.post('/sign-up', signUpSchemaMiddleware, signUp);

authRouter.post('/sign-in', signInSchemaMiddleware, signIn);

authRouter.post('/sign-out', signOut);

authRouter.get('/access-token', getNewAccessToken);

export default authRouter;
