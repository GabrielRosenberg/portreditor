//@ts-check
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

function ErrorDisplay({ message }) {
  return (
    <Grid
      container
      justifyContent={"center"}
      direction={"column"}
      alignItems={"center"}
      width={200}
      height={200}
      bgcolor={(theme) => theme.palette.grey[300]}
      sx={{}}
    >
      <Box sx={{ width: 0.4, height: 0.4 }}>
        <ErrorIcon color={"error"} sx={{ width: 1, height: 1 }} />
      </Box>
      <Typography>{message}</Typography>
    </Grid>
  );
}

export default ErrorDisplay;
