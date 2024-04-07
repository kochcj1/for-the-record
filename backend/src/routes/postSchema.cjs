const yaml = require("yamljs");
const { fieldsToMongoSchema } = require("../utils.cjs");
const { DATABASE_NAME, GROUP_TABLE_SEPARATOR } = require("../env.cjs");

const postSchema = async (req, mongoClient, res) => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const config = yaml.load(req.file.path);
    for (const group of config.groups) {
      for (const table of group.tables) {
        const collectionName = `${group.name}${GROUP_TABLE_SEPARATOR}${table.name}`;
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(
          (collection) => collection.name
        );
        const collectionExists = collectionNames.includes(collectionName);
        const schema = table.fields ? fieldsToMongoSchema(table.fields) : {};

        // If the collection already exists, update its schema:
        if (collectionExists) {
          await db.command({
            collMod: collectionName,
            validator: {
              $jsonSchema: schema,
            },
          });
        }
        // Otherwise, create a collection with the given schema:
        else {
          await db.createCollection(collectionName, {
            validator: {
              $jsonSchema: schema,
            },
          });
        }
      }
    }

    res.status(200).send("Schemas updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  } finally {
    await mongoClient.close();
  }
};

module.exports = postSchema;
