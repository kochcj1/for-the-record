const MIN_INTEGER = Number.MIN_SAFE_INTEGER;
const MAX_INTEGER = Number.MAX_SAFE_INTEGER;

const MIN_DOUBLE = Number.MIN_SAFE_INTEGER; // the actual limmit is greater, but HTML's input field doesn't seem able to handle it
const MAX_DOUBLE = Number.MAX_SAFE_INTEGER; // the actual limmit is greater, but HTML's input field doesn't seem able to handle it

const fieldsToMongoSchema = (fields) => {
  const properties = {};
  fields.forEach((field) => {
    if (field.type === "string") {
      properties[field.name] = {
        bsonType: "string",
        description: field.description || "",
      };
    } else if (field.type === "int" || field.type === "integer") {
      properties[field.name] = {
        bsonType: "int",
        description: field.description || "",
        minimum: field.minimum || MIN_INTEGER,
        maximum: field.maximum || MAX_INTEGER,
      };
    } else if (field.type === "double") {
      properties[field.name] = {
        bsonType: ["double", "int"], // both types included so the client can post integers without error as well
        description: field.description || "",
        minimum: field.minimum || MIN_DOUBLE,
        maximum: field.maximum || MAX_DOUBLE,
      };
    } else if (field.type === "bool" || field.type === "boolean") {
      properties[field.name] = {
        bsonType: "bool",
        description: field.description || "",
      };
    } else if (field.type === "enum" || field.type === "enumeration") {
      properties[field.name] = {
        enum: field.options,
        description: field.description || "",
      };
    }
  });

  const schema = {
    bsonType: "object",
    properties,
  };
  const requiredFields = fields
    .filter((field) => field.required === true)
    .map((field) => field.name);
  if (requiredFields.length > 0) {
    schema.required = requiredFields;
  }
  return schema;
};

module.exports = {
  fieldsToMongoSchema,
};
