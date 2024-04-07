const { DATABASE_NAME, GROUP_TABLE_SEPARATOR } = require("../env.cjs");

const getGroups = async (mongoClient, res) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);
    const groups = {};
    collectionNames.forEach((collectionName) => {
      const splitCollectionName = collectionName.split(GROUP_TABLE_SEPARATOR);
      if (splitCollectionName.length == 2) {
        const [groupName, tableName] = splitCollectionName;
        if (groups.hasOwnProperty(groupName)) {
          groups[groupName].push(tableName);
        } else {
          groups[groupName] = [tableName];
        }
      }
    });
    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  } finally {
    await mongoClient.close();
  }
};

module.exports = getGroups;
