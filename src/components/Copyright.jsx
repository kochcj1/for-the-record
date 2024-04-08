import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { COPYRIGHT_URL } from "../utils/env";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href={COPYRIGHT_URL}>
        For the Record
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default Copyright;
