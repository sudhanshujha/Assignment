import { processTransaction } from '../services/transactionService';

// Controller function to handle processing a transaction
export async function transact(idempotentKey: string, userId: string, amount: number, type: string): Promise<void> {
    try {
        // Process the transaction
        await processTransaction(idempotentKey, userId, amount, type);
    } catch (error) {
        console.error('Error processing transaction:', error);
        throw error;
    }
}
