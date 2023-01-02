//@ts-check
import React from "react";
import { Box } from "@mui/system";
import {
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  circularProgressClasses,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CanvasDisplay from "./CanvasDisplay";
import ErrorDisplay from "./ErrorDisplay";

export const Card = ({ image, removeImage, processImage, downloadImage }) => {
  function FacebookCircularProgress(props) {
    return (
      <Box sx={{ position: "relative" }}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: (theme) => theme.palette.grey[300],
          }}
          size={40}
          thickness={4}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: (theme) =>
              theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
            animationDuration: "550ms",
            position: "absolute",
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
          size={40}
          thickness={4}
          {...props}
        />
      </Box>
    );
  }

  console.log(image.error);

  return (
    <Grid
      container
      item
      direction={"column"}
      justifyContent="space-around"
      sx={{
        minWidth: 500,
        bgcolor: (theme) => theme.palette.grey[300],
        borderRadius: 3,
        pt: 1,
        pb: 3,
        mt: 2,
      }}
    >
      <Grid item position={"relative"} height={12}>
        <IconButton
          sx={{
            float: "right",
            position: "absolute",
            right: 12,
            top: 4,
          }}
          onClick={() => removeImage(image)}
        >
          <CloseIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12} textAlign={"center"} pb={2} margin={"0 auto"}>
        <Typography
          variant="h6"
          fontSize={16}
          width={300}
          noWrap
          fontWeight={"fontWeightMedium"}
        >
          {image.name}
        </Typography>
      </Grid>
      <Grid item container direction="row" justifyContent="space-around">
        <Grid
          item
          justifyContent="space-around"
          sx={{
            display: image.isLoading ? "block" : "none",
          }}
        >
          <FacebookCircularProgress />
        </Grid>
        <Grid
          width={200}
          height={200}
          bgcolor={"white"}
          sx={{
            display: image.isLoading ? "none" : "block",
          }}
        >
          <Box
            component={"img"}
            src={image.src}
            alt="Portrait image"
            sx={{
              display: "block",
              width: 1,
              height: 1,
              objectFit: "contain",
            }}
            onLoad={(e) => processImage(e.target, image)}
          />
        </Grid>
        {image.error === null && (
          <CanvasDisplay image={image} downloadImage={downloadImage} />
        )}
        {image.error !== null && <ErrorDisplay message={image.error} />}
      </Grid>
    </Grid>
  );
};
