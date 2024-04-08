const { ObjectId } = require("bson");
const { DATABASE_NAME, GROUP_TABLE_SEPARATOR } = require("../env.cjs");

const putRecord = async (req, mongoClient, res) => {
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
};

module.exports = putRecord;
