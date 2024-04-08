# For the Record

A generic, record-keeping tool. Use a YML-defined schema to define the fields you care about and their data types.
The web app will then generate the MongoDB collections and React forms necessary to fill in the fields you defined.

Frontend: React
Backend: Express
Database: MongoDB

## Getting started

Install dependencies:

```
npm install
```

Run MongoDB:

```
docker run --name for-the-record-mongo -d -p 27017:27017 mongo
```

Run Express-based web service:

```
node backend/src/server.cjs
```

Provide a schema:

```
curl -X POST -F "file=@tests/schema.test.yml" localhost:3000/api/schemas
```

## Demo

TODO
