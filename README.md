# For the Record

A generic, record-keeping tool. Use a YML-defined schema to define the fields you care about and their data types.
The web app will then generate the MongoDB collections and React forms necessary to fill in the fields you defined.

Frontend: React
Backend: Express
Database: MongoDB

## Getting started

1. Install dependencies:

   ```
   npm install
   ```

1. Run MongoDB:

   ```
   docker run --name for-the-record-mongo -d -p 27017:27017 mongo
   ```

1. Fill in backend's environment variables (if desired). See `backend/src/env.cjs`.

1. Run Express-based web service:

   ```
   node backend/src/server.cjs
   ```

1. Perform a health check:

   ```
   curl localhost:3000/health
   ```

1. Provide a schema:

   ```
   curl -X POST -F "file=@tests/schema.test.yml" localhost:3000/api/schemas
   ```

1. Fill in frontend's environment variables (if desired). See `src/utils/env.js`.

1. Run the frontend locally:

   ```
   npm run dev
   ```

1. Run tests:

   ```
   npm run tests
   ```

## Demo

TODO
