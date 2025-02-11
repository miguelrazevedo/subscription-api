import { Router } from 'express';
import {
    signUpMiddleware,
    signInMiddleware,
} from '../middlewares/auth.schema.middleware.js';
import { signIn, signUp } from '../controllers/auth.controller.js';

const authRouter = Router();

/**
 *
 * /api/auth
 *
 */

authRouter.post('/sign-up', signUpMiddleware, signUp);

authRouter.post('/sign-in', signInMiddleware, signIn);

authRouter.post('/sign-out', (req, res) => {
    res.json({ message: 'Sign out' });
});

export default authRouter;
