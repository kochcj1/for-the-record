# For the Record

A generic, record-keeping tool. Use a YML-defined schema to define the fields you care about and their data types.
The web app will then generate the MongoDB collections and React forms necessary to fill in the fields you defined.

## Stack

- Frontend: React
- Backend: Express
- Database: MongoDB

Credit where credit's due: a free MUI template was used as the starting point for this web app's React frontend

Musi template credit where credits due

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

## Schema

### Supported data types

1. `string`
1. `int`/`integer`
1. `double`
1. `bool`/`boolean`
1. `enum`/`enumeration`

Note:

1. On the backend, all data types provide support for a `description` field that can be used to
   describe a field in more detail. However, on the frontend, the description is only actually used
   by `string`, `int`/`integer`, and `double` fields as this time.
1. Fields of type `int`/`integer` or `double` support `minimum` and `maximum` values.

### Example

```yml
groups:
  - name: My Group
    tables:
      - name: My Table
        fields:
          - name: My String Field
            type: string
          - name: My Integer Field
            type: integer
          - name: My Double Field
            type: double
          - name: My Boolean Field
            type: boolean
          - name: My Enumeration
            type: enumeration
            options:
              - Option 1
              - Option 2
              - Option 3
```

## Demo

TODO
