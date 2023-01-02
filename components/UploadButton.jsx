import { Button, Grid } from "@mui/material";
import React, { createRef } from "react";

export default function UploadButton({ imagesList, setImagesList }) {
  const onFileChange = async (event) => {
    let files = Array.from(event.target.files).map((file) => {
      // Define a new file reader
      let reader = new FileReader();

      // Create a new promise
      return new Promise((resolve) => {
        // Resolve the promise after reading file
        reader.onload = () => resolve(reader.result);
        const blob = new Blob([file], { type: "image/jpg" });

        // Reade the file as a text
        reader.readAsDataURL(blob);
      });
    });

    let res = await Promise.all(files);

    let additionalImages = [];

    res.map((url, idx) => {
      additionalImages.push({
        src: url,
        canvasRef: createRef(),
        name: event.target.files[idx].name,
        isLoading: true,
        error: null,
      });
    });
    setImagesList([...imagesList, ...additionalImages]);
  };

  const resetValue = (event) => {
    event.target.value = null;
  };

  return (
    <Grid item>
      <Button
        // {...getRootProps()}
        variant="contained"
        htmlFor="raised-button-file"
        component="label"
        sx={{
          minWidth: 500,
          height: 50,
          mt: 2,
          mb: 10,
          fontSize: 16,
        }}
      >
        <input
          accept="image/*"
          multiple
          type="file"
          name="files[]"
          id="raised-button-file"
          hidden
          onChange={onFileChange}
          onClick={resetValue}
        />
        Add file
      </Button>
    </Grid>
  );
}
