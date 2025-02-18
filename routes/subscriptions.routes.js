import { Router } from 'express';
import { createSubscriptionMiddleware } from '../middlewares/schema.middleware.js';
import { createSubscription } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

/**
 * All endpoints are protected by the authorizeMiddleware
 * /api/subscriptions
 *
 */
subscriptionRouter.post('/', createSubscriptionMiddleware, createSubscription);

subscriptionRouter.get('/', (req, res) => {
    res.json({ message: 'GET all subscriptions' });
});

subscriptionRouter.get('/:id', (req, res) => {
    res.json({ message: 'GET subscription detail' });
});

subscriptionRouter.put('/:id', (req, res) => {
    res.json({ message: 'UPDATE subscription' });
});

subscriptionRouter.delete('/:id', (req, res) => {
    res.json({ message: 'DELETE subscription' });
});

subscriptionRouter.get('/user/:id', (req, res) => {
    res.json({ message: 'GET user subscriptions' });
});

subscriptionRouter.put('/cancel/:id', (req, res) => {
    res.json({ message: 'CANCEL subscription' });
});

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.json({ message: 'GET upcoming renewals' });
});

export default subscriptionRouter;
