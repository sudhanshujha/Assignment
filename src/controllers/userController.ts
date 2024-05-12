import { getUserBalance } from '../services/dynamoDBService';

// Controller function to handle retrieving current balance for a user
export async function getCurrentBalance(userId: string): Promise<number> {
    try {
        // Retrieve current balance for the user
        const balance = await getUserBalance(userId);
        return balance;
    } catch (error) {
        console.error('Error getting current balance:', error);
        throw error;
    }
}
