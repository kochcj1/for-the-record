const express = require("express");
const multer = require("multer");
const { MongoClient } = require("mongodb");
const { group } = require("console");
const getHealth = require("./routes/getHealth.cjs");
const postSchema = require("./routes/postSchema.cjs");
const getGroups = require("./routes/getGroups.cjs");
const {
  SERVER_PORT,
  MONGO_URL,
  DATABASE_NAME,
  GROUP_TABLE_SEPARATOR,
} = require("./env.cjs");

// TODO:
// - Use middleware to connect to MongoDB once (ensure that disconnect happens automatically when the server shuts down)
// - Move routes into their own files

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
app.get("/api/groups", (_req, res) => getGroups(mongoClient, res));

// A route that can be used to add a record to a given table.
app.post("/api/:group/:table/records", async (req, res) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const collectionName = `${req.params.group}${GROUP_TABLE_SEPARATOR}${req.params.table}`;
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    if (result.acknowledged) {
      res.status(201).send({
        message: "Record added successfully",
        recordId: result.insertedId,
      });
    } else {
      res.status(400).send("Failed to add record");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  } finally {
    await mongoClient.close();
  }
});

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
app.get("/api/:group/:table/records", async (req, res) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const collectionName = `${req.params.group}${GROUP_TABLE_SEPARATOR}${req.params.table}`;
    const collection = db.collection(collectionName);
    const query = { isArchived: { $ne: true } }; // exclude archived records
    const records = await collection.find(query).toArray();
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).send("An error occurred while fetching records.");
  } finally {
    await mongoClient.close();
  }
});

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
