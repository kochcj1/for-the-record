const { DATABASE_NAME, GROUP_TABLE_SEPARATOR } = require("../env.cjs");

const getRecords = async (req, mongoClient, res) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const collectionName = `${req.params.group}${GROUP_TABLE_SEPARATOR}${req.params.table}`;
    const collectionInfo = await db.command({
      listCollections: 1,
      filter: { name: collectionName },
    });
    const schema =
      collectionInfo.cursor.firstBatch[0].options.validator.$jsonSchema;
    const collection = db.collection(collectionName);
    const query = { isArchived: { $ne: true } }; // exclude archived records
    const records = await collection.find(query).toArray();
    res.status(200).json({ schema, records });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).send("An error occurred while fetching records.");
  } finally {
    await mongoClient.close();
  }
};

module.exports = getRecords;
