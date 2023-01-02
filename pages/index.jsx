import Head from "next/head";
import styles from "../styles/Home.module.css";
import UploadButton from "../components/UploadButton";
import { useEffect, useState, createRef } from "react";
import { Box } from "@mui/system";
import { Button, Typography, Grid } from "@mui/material";
import cv from "@techstark/opencv-js";
import JSZip from "jszip";
import { reject, findIndex } from "lodash";
import { saveAs } from "file-saver";
import {
  loadHaarFaceModels,
  detectHaarFace,
} from "../utilities/haarFaceDetection";
import maskImage from "../public/circularMask.png";
import { Card } from "../components/Card";

export default function Home() {
  const [imagesList, setImagesList] = useState([]);
  const maskImgRef = createRef();
  const [mask, setMask] = useState(null);

  useEffect(() => {
    loadHaarFaceModels();
    setMask(new cv.Mat());
  }, []);

  useEffect(() => {
    if (mask !== null) loadMask();
  }, [mask]);

  // Loads the static mask image by creating a img element,
  // the source image needs to be loaded from the DOM and should not be seen
  const loadMask = () => {
    const img = document.createElement("img");
    img.src = maskImage.src;
    img.height = maskImage.height;
    img.width = maskImage.width;
    const maskImageCv = cv.imread(maskImgRef.current);
    cv.cvtColor(maskImageCv, mask, cv.COLOR_RGBA2GRAY, 0);
    cv.cvtColor(mask, mask, cv.COLOR_GRAY2RGB, 0);
  };

  const processImage = (target, image) => {
    // Clone img element to make it independent of parent size
    const clone = target.cloneNode(true);
    let img;
    try {
      img = cv.imread(clone);
    } catch (error) {
      throw "Failed to read image";
    }
    let imgBg = new cv.Mat();

    // to gray scale
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);
    cv.cvtColor(imgGray, imgGray, cv.COLOR_GRAY2RGB);

    let newImgResized = new cv.Mat();
    let errorMsg = null;
    try {
      // Detect face
      newImgResized = detectHaarFace(imgGray);
    } catch (error) {
      errorMsg = error;
    }

    if (errorMsg === null) {
      // Create white mask around image
      cv.bitwise_or(newImgResized, mask, imgBg);

      // Load the image into the canvas element
      cv.imshow(image.canvasRef.current, imgBg);
    }

    img.delete();
    imgBg.delete();
    imgGray.delete();
    newImgResized.delete();

    // Update the status of the processed image
    const imagesListCopy = Array.from(imagesList);
    const itemIdx = findIndex(
      imagesListCopy,
      (item) => image.name === item.name
    );
    imagesListCopy[itemIdx].isLoading = false;
    imagesListCopy[itemIdx].error = errorMsg;
    setImagesList(imagesListCopy);
  };

  function dataUriToBlob(dataUri) {
    const b64 = Buffer.from(dataUri.split(",")[1], "base64").toString("latin1");
    const u8 = Uint8Array.from(b64.split(""), (e) => e.charCodeAt());
    return new Blob([u8], { type: "image/jpg" });
  }

  const downloadAllImages = () => {
    var zip = new JSZip();
    imagesList.map((image) => {
      console.log(image);
      if (image.error === null) {
        const canvas = image.canvasRef.current;
        const data = canvas.toDataURL();
        const imageBlob = dataUriToBlob(data);
        zip.file(image.name, imageBlob);
      }
    });

    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, `${imagesList.length}_circular_images.zip`);
    });
  };

  const downloadImage = (image) => {
    const url = getBlobFromCanvas(image.canvasRef);
    const link = document.createElement("a");
    link.download = `${image.name}_edit.jpg`;
    link.href = url;
    link.click();
  };

  const getBlobFromCanvas = (canvasRef) => {
    // TODO might be meaningfull to replace with https://github.com/eligrey/canvas-toBlob.js
    const canvas = canvasRef.current;
    const data = canvas.toDataURL();
    const url = URL.createObjectURL(dataUriToBlob(data));
    return url;
  };

  const removeImage = (image) => {
    const imagesListCopy = Array.from(imagesList);
    const newImagesList = reject(
      imagesListCopy,
      (item) => item.name === image.name
    );
    setImagesList(newImagesList);
  };

  return (
    <>
      <Head>
        <title>Portrait editor</title>
        <meta
          name="description"
          content="Automates editing of portrait images"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className={styles.main}>
        <Box
          component={"img"}
          src={maskImage.src}
          alt="Mask image"
          sx={{ display: "none" }}
          ref={maskImgRef}
        />
        <Box>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            py={3}
          >
            {imagesList.map((image) => (
              <Card
                key={`${image.name}`}
                image={image}
                removeImage={removeImage}
                processImage={processImage}
                downloadImage={downloadImage}
              />
            ))}
            <UploadButton
              imagesList={imagesList}
              setImagesList={setImagesList}
            />
          </Grid>
        </Box>
        <Grid
          container
          position={"fixed"}
          bottom={0}
          height={100}
          direction={"column"}
          justifyContent={"end"}
          textAlign={"center"}
        >
          <Grid
            item
            height={80}
            bgcolor={"white"}
            sx={{ boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.3)" }}
          >
            <Button
              variant={"contained"}
              onClick={downloadAllImages}
              color="success"
              disabled={imagesList.length > 0 ? false : true}
              sx={{
                minWidth: 500,
                height: 50,
                mt: 2,
              }}
            >
              <Typography>Download all</Typography>
            </Button>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
