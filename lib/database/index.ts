import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Initialized cached variable
 * Attempt to retrive a property from global object
 * Global is type that intend to store global variables
 * Cached variable intend to hold cach connection to db
 */

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDataBase = async () => {
    if (cached.conn) return cached.conn

    if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

    /**
     *Either connect to already existing cache connection or
     *create a new connection
     */
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'eventify',
        bufferCommands: false,
    })

    cached.conn = await cached.promise;

    return cached.conn
}