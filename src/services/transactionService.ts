import { DynamoDB } from 'aws-sdk';
import { dynamoDBConfig } from '../config/dynamoDBConfig';

// Create DynamoDB instance with configured options
const dynamoDB = new DynamoDB.DocumentClient(dynamoDBConfig);

// Function to process a transaction
export async function processTransaction(idempotentKey: string, userId: string, amount: number, type: string): Promise<void> {
    try {
        // Check if transaction is idempotent to prevent duplicate transactions
        const idempotentCheckParams = {
            TableName: 'TransactionIdempotencyTable',
            Key: {
                idempotentKey: idempotentKey
            }
        };

        const idempotentData = await dynamoDB.get(idempotentCheckParams).promise();

        if (idempotentData.Item) {
            console.log('Transaction already processed with idempotent key:', idempotentKey);
            return; // Transaction already processed
        }

        // Check if it's a credit or debit transaction
        const transactionAmount = type === 'credit' ? amount : -amount;

        // Get current user balance
        const currentBalanceParams = {
            TableName: 'UserBalancesTable',
            Key: {
                userId: userId
            }
        };

        const userData = await dynamoDB.get(currentBalanceParams).promise();
        const currentBalance = userData.Item?.balance || 0;

        // Calculate new balance
        const newBalance = currentBalance + transactionAmount;

        // Check if balance will go below 0
        if (newBalance < 0) {
            throw new Error('Insufficient funds');
        }

        // Update user balance
        const updateBalanceParams = {
            TableName: 'UserBalancesTable',
            Key: {
                userId: userId
            },
            UpdateExpression: 'SET balance = :balance',
            ExpressionAttributeValues: {
                ':balance': newBalance
            }
        };

        await dynamoDB.update(updateBalanceParams).promise();

        // Mark transaction as processed to prevent duplicate transactions
        const idempotentParams = {
            TableName: 'TransactionIdempotencyTable',
            Item: {
                idempotentKey: idempotentKey
            }
        };

        await dynamoDB.put(idempotentParams).promise();

        console.log('Transaction processed successfully:', idempotentKey);
    } catch (error) {
        console.error('Error processing transaction:', error);
        throw error;
    }
}
