import { body } from 'express-validator';

export const validateAIQuery = [
  body('query')
    .trim()
    .notEmpty()
    .withMessage('Query string is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Query must be between 3 and 500 characters'),
];

export const validateAISQL = [
  body('sql')
    .trim()
    .notEmpty()
    .withMessage('SQL string is required')
    .isLength({ min: 10 })
    .withMessage('SQL statement is too short')
    .custom((val) => {
      const sqlLower = val.toLowerCase();
      // Block non-SELECT query statements (security precaution)
      const blockedKeywords = ['insert', 'update', 'delete', 'drop', 'truncate', 'alter', 'create', 'grant'];
      for (const keyword of blockedKeywords) {
        if (sqlLower.includes(keyword)) {
          throw new Error(`Direct executions are limited to SELECT queries only. Blocked keyword found: ${keyword}`);
        }
      }
      return true;
    }),
];
