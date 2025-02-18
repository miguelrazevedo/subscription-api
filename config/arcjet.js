import arcjet, { shield, detectBot, tokenBucket } from '@arcjet/node';
import { ARCJET_KEY } from '../config/env.js';

const aj = arcjet({
    key: ARCJET_KEY,
    characteristics: ['ip.src'],
    rules: [
        shield({ mode: 'LIVE' }),
        detectBot({
            mode: 'LIVE',
            allow: [
                'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc
                'CATEGORY:PREVIEW', // Link previews e.g. Slack, Discord
            ],
        }),
        tokenBucket({
            mode: 'LIVE',
            refillRate: 2, // Refill 2 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ],
});

export default aj;
