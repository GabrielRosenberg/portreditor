import cv from "@techstark/opencv-js";
import { loadDataFile } from "./cvDataFile";

export async function loadHaarFaceModels() {
  try {
    console.log("=======start downloading Haar-cascade models=======");
    await loadDataFile(
      "haarcascade_frontalface_default.xml",
      "/model/haarcascade_frontalface_default.xml"
    );
    console.log("=======downloaded Haar-cascade models=======");
  } catch (error) {
    console.error(`error when loading Haar Faces model ${error}`);
  }
}

/**
 * Detect faces from the input image.
 * See https://docs.opencv.org/master/d2/d99/tutorial_js_face_detection.html
 * @param {cv.Mat} img Input image
 * @returns a new croped image.
 */
export function detectHaarFace(img) {
  let newImg;
  try {
    newImg = img.clone();
  } catch (e) {
    throw "Failed to clone";
  }
  const gray = new cv.Mat();
  let faceRect;

  try {
    cv.cvtColor(newImg, gray, cv.COLOR_RGBA2GRAY, 0);
  } catch (e) {
    newImg.delete();
    gray.delete();
    throw "Failed to convert into gray colorspace";
  }

  const faces = new cv.RectVector();
  const faceCascade = new cv.CascadeClassifier();
  // load pre-trained classifiers
  faceCascade.load("haarcascade_frontalface_default.xml");

  // detect faces
  const minSize = new cv.Size(100, 100);
  const maxSize = new cv.Size(3000, 3000);
  try {
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, minSize, maxSize);
  } catch {
    newImg.delete();
    gray.delete();

    faces.delete();
    faceCascade.delete();
    throw "Failed to detect faces";
  }

  console.log(faces.size());
  if (faces.size() === 0) {
    newImg.delete();
    gray.delete();

    faces.delete();
    faceCascade.delete();
    throw "No faces detected";
  }

  const idx = faces.size() - 1;

  const xMargin = Math.floor(faces.get(idx).width * 0.4);
  const yMargin = Math.floor(faces.get(idx).height * 0.4);

  faceRect = new cv.Rect(
    faces.get(idx).x - xMargin,
    faces.get(idx).y - yMargin,
    faces.get(idx).width + xMargin * 2,
    faces.get(idx).height + yMargin * 2
  );

  let cropedFace;
  try {
    cropedFace = newImg.roi(faceRect);
  } catch (error) {
    newImg.delete();
    gray.delete();
    faces.delete();
    faceCascade.delete();
    throw "Image too narrow";
  }

  // Resize image to 800x800
  let newImgResized = new cv.Mat();
  try {
    cv.resize(
      cropedFace,
      newImgResized,
      new cv.Size(800, 800),
      0,
      0,
      cv.INTER_LINEAR
    );
  } catch (error) {
    newImg.delete();
    gray.delete();
    cropedFace.delete();
    faceCascade.delete();
    faces.delete();
    throw "Failed to resize";
  }

  newImg.delete();
  gray.delete();
  cropedFace.delete();
  faceCascade.delete();
  faces.delete();

  return newImgResized;
}
