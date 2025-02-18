import { z } from 'zod';

// User schema
export const registerZodSchema = z.object({
    name: z.string().min(6).trim(),
    email: z.string().email(),
    password: z.string().min(6),
});

export const loginZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

// Subscription schema
export const createSubscriptionZodSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    price: z.number().min(0).max(1000),
    currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    category: z.enum([
        'sports',
        'news',
        'entertainment',
        'lifestyle',
        'technology',
        'finance',
        'politics',
        'other',
    ]),
    paymentMethod: z.string().trim(),
    status: z.enum(['active', 'cancelled', 'expired']).default('active'),
    startDate: z.string().date(),
});
