import { Router } from 'express';

const userRouter = Router();
/**
 *
 * /api/users
 *
 */
userRouter.post('/', (req, res) => {
    res.json({ message: 'CREATE a new user' });
});

userRouter.get('/', (req, res) => {
    res.json({ message: 'GET all users' });
});

userRouter.get('/:id', (req, res) => {
    res.json({ message: 'GET user' });
});

userRouter.put('/:id', (req, res) => {
    res.json({ message: 'UPDATE user' });
});

userRouter.delete('/:id', (req, res) => {
    res.json({ message: 'DELETE user' });
});

export default userRouter;
