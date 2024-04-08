const { DATABASE_NAME, GROUP_TABLE_SEPARATOR } = require("../env.cjs");

const postRecords = async (req, mongoClient, res) => {
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
};

module.exports = postRecords;
