import { Router } from 'express';
import { createSubscriptionMiddleware } from '../middlewares/schema.middleware.js';
import {
    createSubscription,
    deleteSubscription,
    getAllSubscriptions,
    getSubscription,
    getUserSubscriptions,
    updateSubscription,
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

/**
 * All endpoints are protected by the authorizeMiddleware
 *
 *
 * /api/subscriptions
 *
 */
subscriptionRouter.post('/', createSubscriptionMiddleware, createSubscription);

subscriptionRouter.get('/', getAllSubscriptions);

subscriptionRouter.get('/:id', getSubscription);

subscriptionRouter.put('/:id', updateSubscription);

subscriptionRouter.delete('/:id', deleteSubscription);

subscriptionRouter.get('/user/:id', getUserSubscriptions);

export default subscriptionRouter;
