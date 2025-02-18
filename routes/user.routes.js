import { Router } from 'express';
import {
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUserById,
} from '../controllers/user.controller.js';
import { signInSchemaMiddleware } from '../middlewares/schema.middleware.js';

const userRouter = Router();
/**
 * All endpoints are protected by the authorizeMiddleware
 *
 *
 * /api/users
 *
 */

userRouter.get('/', getAllUsers);

userRouter.get('/:id', getUserById);

// Use the signInMiddleware to verify the body to update the user
userRouter.put('/:id', signInSchemaMiddleware, updateUserById);

userRouter.delete('/:id', deleteUserById);

export default userRouter;
