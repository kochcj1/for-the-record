import React from "react";
import SchemaField from "./SchemaField";

export default function SchemaForm({
  schema,
  defaultValues,
  onSchemaFieldChange,
}) {
  const properties = schema?.properties;
  const requiredProperties = schema?.required || [];

  return (
    <React.Fragment>
      {Object.entries(properties).map((property) => {
        const [propertyName, propertyInfo] = property;
        const required = requiredProperties.includes(propertyName);
        return (
          <SchemaField
            key={propertyName}
            propertyName={propertyName}
            propertyInfo={propertyInfo}
            defaultValue={defaultValues?.[propertyName]}
            required={required}
            onChange={(propertyValue) =>
              onSchemaFieldChange(propertyName, propertyValue)
            }
          />
        );
      })}
    </React.Fragment>
  );
}
