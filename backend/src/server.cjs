const cors = require("cors");
const multer = require("multer");
const express = require("express");
const { MongoClient } = require("mongodb");
const getHealth = require("./routes/getHealth.cjs");
const postSchema = require("./routes/postSchema.cjs");
const getGroups = require("./routes/getGroups.cjs");
const postRecord = require("./routes/postRecord.cjs");
const getRecords = require("./routes/getRecords.cjs");
const {
  SERVER_PORT,
  MONGO_URL,
  DATABASE_NAME,
  GROUP_TABLE_SEPARATOR,
} = require("./env.cjs");

// TODO:
// - Use middleware to connect to MongoDB once (ensure that disconnect happens automatically when the server shuts down)
// - Move routes into their own files
// - Access log
// - Only use JSON and other middleware where needed?

const app = express();
const upload = multer({ dest: "uploads/" });
const mongoClient = new MongoClient(MONGO_URL);

// Middleware to parse JSON bodies.
app.use(express.json());

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
app.post("/api/:group/:table/records", cors(), (req, res) =>
  postRecord(req, mongoClient, res)
);

// A route that can be used to update an existing record.
app.put("/api/:group/:table/records/:recordId", async (req, res) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const collectionName = `${req.params.group}${GROUP_TABLE_SEPARATOR}${req.params.table}`;
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.recordId) },
      { $set: req.body } // use $set to update only the fields provided in req.body
    );
    if (result.modifiedCount === 1) {
      res.status(200).send("Record updated successfully");
    } else {
      res.status(404).send("Record not found or no changes made");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  } finally {
    await mongoClient.close();
  }
});

// A route that can be used to retrieve a given table's records.
app.get("/api/:group/:table/records", cors(), (req, res) =>
  getRecords(req, mongoClient, res)
);

// A route that can be used to delete an existing record.
app.delete("/api/:group/:table/records/:recordId", async (req, res) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const collectionName = `${req.params.gruop}_${req.params.table}`;
    const collection = db.collection(collectionName);

    // Soft delete the record by setting isArchived flag:
    if (req.query.soft === "true") {
      const result = await collection.updateOne(
        { _id: new ObjectId(req.params.recordId) },
        { $set: { isArchived: true } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).send("Record soft deleted successfully");
      } else {
        res.status(404).send("Record not found");
      }
    }
    // Permanently delete the record:
    else {
      const result = await collection.deleteOne({
        _id: new ObjectId(req.params.recordId),
      });

      if (result.deletedCount === 1) {
        res.status(200).send("Record deleted successfully");
      } else {
        res.status(404).send("Record not found");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  } finally {
    await mongoClient.close();
  }
});

app.listen(SERVER_PORT, () =>
  console.log(`Server running on port ${SERVER_PORT}`)
);

module.exports = app;
