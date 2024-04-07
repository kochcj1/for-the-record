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
// - Consolidate integer and double text field code b/c it's almost identical
// - Fix the fact that the integer text field still allows doubles

export default function SchemaField({ propertyName, propertyInfo, required }) {
  if (propertyInfo.bsonType === "string") {
    return (
      <TextField
        required={required}
        label={propertyName}
        helperText={propertyInfo.description}
        variant="outlined"
        margin="dense"
        multiline
        fullWidth
      />
    );
  } else if (propertyInfo.bsonType === "int") {
    return (
      <TextField
        label={propertyName}
        type="number"
        required={required}
        helperText={propertyInfo.description}
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        inputProps={{
          step: 1,
          min: propertyInfo.minimum,
          max: propertyInfo.maximum,
        }}
        margin="dense"
        fullWidth
      />
    );
  } else if (propertyInfo.bsonType === "double") {
    return (
      <TextField
        label={propertyName}
        type="number"
        required={required}
        helperText={propertyInfo.description}
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        inputProps={{
          step: "any",
          min: propertyInfo.minimum,
          max: propertyInfo.maximum,
        }}
        margin="dense"
        fullWidth
      />
    );
  } else if (propertyInfo.bsonType === "bool") {
    return (
      <FormGroup>
        <FormControlLabel control={<Checkbox />} label={propertyName} />
      </FormGroup>
    );
  } else if (propertyInfo.hasOwnProperty("enum")) {
    return (
      <FormControl required={required} margin="dense" fullWidth>
        <InputLabel id={`${propertyName}-label`}>{propertyName}</InputLabel>
        <Select
          defaultValue={propertyInfo.enum[0]}
          labelId={`${propertyName}-label`}
          label={propertyName}
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
