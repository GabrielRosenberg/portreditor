/// Not used but kept if Photopea would be needed in the future
export default `
function Circle() {
  var desc1 = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putClass(stringIDToTypeID("contentLayer"));
  desc1.putReference(charIDToTypeID("null"), ref1);
  var desc2 = new ActionDescriptor();
  var desc3 = new ActionDescriptor();
  var desc4 = new ActionDescriptor();
  desc4.putDouble(charIDToTypeID("Rd  "), 255);
  desc4.putDouble(charIDToTypeID("Grn "), 255);
  desc4.putDouble(charIDToTypeID("Bl  "), 255);
  desc3.putObject(charIDToTypeID("Clr "), stringIDToTypeID("RGBColor"), desc4);
  desc2.putObject(
    charIDToTypeID("Type"),
    stringIDToTypeID("solidColorLayer"),
    desc3
  );
  var desc5 = new ActionDescriptor();
  desc5.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), 0);
  desc5.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), 0);
  desc5.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), 500);
  desc5.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), 500);
  desc2.putObject(charIDToTypeID("Shp "), charIDToTypeID("Elps"), desc5);
  desc1.putObject(
    charIDToTypeID("Usng"),
    stringIDToTypeID("contentLayer"),
    desc2
  );
  executeAction(charIDToTypeID("Mk  "), desc1, DialogModes.NO);
}

function applyClippingMask() {
  // Grab the needed IDs
  const groupEventID = stringIDToTypeID("groupEvent");
  const nullID = stringIDToTypeID("null");
  const layerID = stringIDToTypeID("layer");
  const ordinalID = stringIDToTypeID("ordinal");
  const targetEnumID = stringIDToTypeID("targetEnum");

  // Prep the action
  const actionDesc = new ActionDescriptor();
  const actionRef = new ActionReference();

  // Prep the mask
  actionRef.putEnumerated(layerID, ordinalID, targetEnumID);
  actionDesc.putReference(nullID, actionRef);

  // Apply the mask
  executeAction(groupEventID, actionDesc, DialogModes.NO);
}

Circle();

var docRef = app.activeDocument;
docRef.artLayers[1].move(docRef.artLayers[0], ElementPlacement.PLACEBEFORE);

applyClippingMask();

docRef.artLayers[1].desaturate();
app.echoToOE("Hello");
`;
