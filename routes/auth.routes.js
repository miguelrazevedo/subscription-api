import { Router } from 'express';
import {
    signUpMiddleware,
    signInMiddleware,
} from '../middlewares/auth.middleware.js';
import {
    getNewAccessToken,
    signIn,
    signOut,
    signUp,
} from '../controllers/auth.controller.js';

const authRouter = Router();

/**
 *
 * /api/auth
 *
 */

authRouter.post('/sign-up', signUpMiddleware, signUp);

authRouter.post('/sign-in', signInMiddleware, signIn);

authRouter.post('/sign-out', signOut);

authRouter.get('/access-token', getNewAccessToken);

export default authRouter;
