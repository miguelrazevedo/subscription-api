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
