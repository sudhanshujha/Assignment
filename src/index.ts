import { getCurrentBalance } from './controllers/userController';
import { transact } from './controllers/transactionController';

// Example usage for Task 1: Retrieve Current Balance Function
const userId = '1';
getCurrentBalance(userId)
    .then(balance => {
        console.log(`Current balance for user ${userId}: ${balance}`);
    })
    .catch(error => {
        console.error('Error retrieving balance:', error);
    });

// Example usage for Task 2: Transact Function
const idempotentKey = '123456789';
const transactParams = {
    idempotentKey: idempotentKey,
    userId: '1',
    amount: 10,
    type: 'credit'
};

transact(transactParams.idempotentKey, transactParams.userId, transactParams.amount, transactParams.type)
    .then(() => {
        console.log('Transaction completed successfully');
    })
    .catch(error => {
        console.error('Error processing transaction:', error);
    });
