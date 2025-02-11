import jwt from 'jsonwebtoken';

import {
    JWT_ACCESS_EXPIRES_IN,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_EXPIRES_IN,
    JWT_REFRESH_SECRET,
} from '../config/env.js';

export const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
};

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
    });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
};
