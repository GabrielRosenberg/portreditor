//@ts-check
import React from "react";
import { Box } from "@mui/system";
import { Grid, ButtonBase } from "@mui/material";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

function CanvasDisplay({ image, downloadImage }) {
  return (
    <Grid
      key={`${image.name}_canvas`}
      width={200}
      height={200}
      bgcolor={(theme) => theme.palette.grey[300]}
      position={"relative"}
      textAlign={"center"}
      sx={{
        display: image.isLoading ? "none" : "block",
        "&:hover": {
          "& .downloadIcon": {
            opacity: 0.5,
          },
        },
      }}
    >
      <Box
        component={"canvas"}
        ref={image.canvasRef}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          textAlign: "center",
        }}
      ></Box>
      <ButtonBase
        sx={{
          transition: "0.1s",
          width: 1,
          height: 1,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        onClick={() => downloadImage(image)}
      >
        <ArrowCircleDownIcon
          className="downloadIcon"
          sx={{
            transition: "0.1s",
            width: 1,
            color: "rgb(255, 255, 255)",
            opacity: 0,
            height: 150,
          }}
        />
      </ButtonBase>
    </Grid>
  );
}

export default CanvasDisplay;
