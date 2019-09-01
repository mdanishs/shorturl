import customenv from 'custom-env';
customenv.env(true);

export const  PORT = process.argv['port'] || 3000;
export const DB_NAME = process.env.DB_NAME;
export const DB_CONNECTION = process.env.DB_CONNECTION;
export const URL_COLLECTION = process.env.URL_COLLECTION;

export const BASE_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';