import {
  TextField,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";

// TODO:
// - Fix the fact that the integer text field still allows doubles

export default function SchemaField({
  propertyName,
  propertyInfo,
  defaultValue,
  required,
  onChange,
}) {
  if (propertyInfo.bsonType === "string") {
    return (
      <TextField
        label={propertyName}
        helperText={propertyInfo.description}
        defaultValue={defaultValue}
        required={required}
        variant="outlined"
        margin="dense"
        multiline
        fullWidth
        onChange={(event) => onChange(event.target.value)}
      />
    );
  } else if (propertyInfo.bsonType === "int") {
    return (
      <NumericField
        label={propertyName}
        helperText={propertyInfo.description}
        defaultValue={defaultValue}
        required={required}
        minimum={propertyInfo.minimum}
        maximum={propertyInfo.maximum}
        step={1}
        onChange={(value) => onChange(parseInt(value))}
      />
    );
  }
  // For fields that are declared to be doubles, the actual BSON types that are
  // used when setting up the field's Mongo validation schema are "double" AND "int".
  // Otherwise, posting an integer to a field that's declared to be only a double,
  // doesn't work. Therefore, we check here that the field's type *includes* "double":
  else if (propertyInfo.bsonType?.includes("double")) {
    return (
      <NumericField
        label={propertyName}
        helperText={propertyInfo.description}
        defaultValue={defaultValue}
        required={required}
        minimum={propertyInfo.minimum}
        maximum={propertyInfo.maximum}
        step="any"
        onChange={(value) => onChange(parseFloat(value))}
      />
    );
  } else if (propertyInfo.bsonType === "bool") {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={defaultValue}
              onChange={(event) => onChange(event.target.checked)}
            />
          }
          label={propertyName}
        />
      </FormGroup>
    );
  } else if (propertyInfo.hasOwnProperty("enum")) {
    return (
      <FormControl required={required} margin="dense" fullWidth>
        <InputLabel id={`${propertyName}-label`}>{propertyName}</InputLabel>
        <Select
          label={propertyName}
          labelId={`${propertyName}-label`}
          defaultValue={defaultValue || propertyInfo.enum[0]}
          onChange={(event) => onChange(event.target.value)}
        >
          {propertyInfo.enum.map((option) => {
            return (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }
}

function NumericField({
  label,
  helperText,
  defaultValue,
  required,
  step,
  minimum,
  maximum,
  onChange,
}) {
  return (
    <TextField
      type="number"
      label={label}
      helperText={helperText}
      defaultValue={defaultValue}
      required={required}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        step,
        min: minimum,
        max: maximum,
      }}
      variant="outlined"
      margin="dense"
      fullWidth
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
