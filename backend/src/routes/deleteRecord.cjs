const { ObjectId } = require("bson");
const { DATABASE_NAME, GROUP_TABLE_SEPARATOR } = require("../env.cjs");

const deleteRecord = async (req, mongoClient, res) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const collectionName = `${req.params.group}${GROUP_TABLE_SEPARATOR}${req.params.table}`;
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
};

module.exports = deleteRecord;
