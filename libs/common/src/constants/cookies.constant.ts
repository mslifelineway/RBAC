import { CookieOptions } from 'express';

export const Authentication = 'Authentication';

export const cookiesOptions: CookieOptions = {
  httpOnly: true,
  // secure: process.env.NODE_ENV === 'production',
  // sameSite: 'none',
  // path: '/',
};
