const cors = require("cors");
const multer = require("multer");
const express = require("express");
const { MongoClient } = require("mongodb");
const getHealth = require("./routes/getHealth.cjs");
const postSchema = require("./routes/postSchema.cjs");
const getGroups = require("./routes/getGroups.cjs");
const postRecord = require("./routes/postRecord.cjs");
const getRecords = require("./routes/getRecords.cjs");
const putRecord = require("./routes/putRecord.cjs");
const deleteRecord = require("./routes/deleteRecord.cjs");
const { SERVER_PORT, MONGO_URL } = require("./env.cjs");

// TODO:
// - Use middleware to connect to MongoDB once (ensure that disconnect happens automatically when the server shuts down)
// - Creation and modification times
// - Separate frontend and backend dependencies

const app = express();
const upload = multer({ dest: "uploads/" });
const mongoClient = new MongoClient(MONGO_URL);

// Middleware to add access logging.
const morgan = require("morgan");
app.use(morgan("tiny"));

// A route that can be used to check the health of the server and its underlying MongoDB instance.
app.get("/health", (_req, res) => getHealth(mongoClient, res));

// A route that can be used to upload YAML files as a schema that defines MongoDB collections
// and their schemas.
app.post("/api/schemas", upload.single("file"), (req, res) =>
  postSchema(req, mongoClient, res)
);

// A route that can be used to retreive all groups and their corresponding tables.
app.get("/api/groups", cors(), (_req, res) => getGroups(mongoClient, res));

// A route that can be used to add a record to a given table.
app.options("/api/:group/:table/records", cors());
app.post("/api/:group/:table/records", cors(), express.json(), (req, res) =>
  postRecord(req, mongoClient, res)
);

// A route that can be used to update an existing record.
app.put(
  "/api/:group/:table/records/:recordId",
  cors(),
  express.json(),
  (req, res) => putRecord(req, mongoClient, res)
);

// A route that can be used to retrieve a given table's records.
app.get("/api/:group/:table/records", cors(), (req, res) =>
  getRecords(req, mongoClient, res)
);

// A route that can be used to delete an existing record (including soft deletes).
app.options("/api/:group/:table/records/:recordId", cors());
app.delete("/api/:group/:table/records/:recordId", cors(), (req, res) =>
  deleteRecord(req, mongoClient, res)
);

app.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_PORT}`)
);

module.exports = app;
