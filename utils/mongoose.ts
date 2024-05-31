import mongoose from 'mongoose';
import { MONGODB_URI } from '@/config/constants';

const options = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  ssl: true, // Enable SSL
};

class Database {
  private static instance: Database;
  private isConnected: boolean;
  
  private constructor() {
    this.isConnected = false;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await mongoose.connect(MONGODB_URI, options);
        console.log('Connected to MongoDB');
        this.isConnected = true;
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Rethrow the error to propagate it to the caller
      }
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

const database = Database.getInstance();
export const connectToDatabase = database.connect.bind(database);
export const getConnectionStatus = database.getConnectionStatus.bind(database);

