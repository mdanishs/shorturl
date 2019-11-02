import customenv from 'custom-env';
customenv.env(true);

export const  PORT = process.argv['port'] || 3003;
export const DB_NAME = process.env.DB_NAME;
export const DB_CONNECTION = process.env.DB_CONNECTION;
export const URL_COLLECTION = process.env.URL_COLLECTION;
export const RESTAURANT_COLLECTION = process.env.RESTAURANT_COLLECTION;
export const OLD_RESTAURANT_COLLECTION = process.env.OLD_RESTAURANT_COLLECTION;
export const FOODVISE_COLLECTION = process.env.FOODVISE_COLLECTION;
export const INDEX_COLLECTION = process.env.INDEX_COLLECTION;
export const PEEKABOO_COLLECTION = process.env.PEEKABOO_COLLECTION;

export const BASE_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';