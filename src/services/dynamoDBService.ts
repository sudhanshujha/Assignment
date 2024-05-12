import { DynamoDB } from 'aws-sdk';
import { dynamoDBConfig } from '../config/dynamoDBConfig';

// Create DynamoDB instance with configured options
const dynamoDB = new DynamoDB.DocumentClient(dynamoDBConfig);

// Function to retrieve user balance from DynamoDB
export async function getUserBalance(userId: string): Promise<number> {
    try {
        // Define DynamoDB params
        const params = {
            TableName: 'UserBalancesTable',
            Key: {
                userId: userId
            }
        };

        // Retrieve user balance from DynamoDB
        const data = await dynamoDB.get(params).promise();

        // If balance record exists, return the balance, otherwise return default value
        return data.Item?.balance || 100;
    } catch (error) {
        console.error('Error retrieving user balance:', error);
        throw error;
    }
}
