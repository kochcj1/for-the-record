const MIN_INTEGER = -2147483648;
const MAX_INTEGER = 2147483647;

const MIN_DOUBLE =
  -179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368;
const MAX_DOUBLE = 179769313486231570814527423731704356798070567525844996598917476803157260780028538760589558632766878171540458953514382464234321326889464182768467546703537516986049910576551282076245490090389328944075868508455133942304583236903222948165808559332123348274797826204144723168738177180919299881250404026184124858368;

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
        bsonType: "double",
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
