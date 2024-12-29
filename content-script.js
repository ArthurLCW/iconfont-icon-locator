import ssim from "ssim.js";

let svgElements = [];
window.onload = () => {
  svgElements = document.querySelectorAll("svg.icon");
  console.log(
    "lcw onload testing",
    svgElements,
    document.querySelectorAll("svg.icon")
  );
};
setTimeout(() => {
  svgElements = document.querySelectorAll("svg.icon");
  console.log(
    "lcw settimeout",
    svgElements,
    document.querySelectorAll("svg.icon")
  );
}, 3000);

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log(
    "lcw i am content",
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension",
    svgElements
  );

  const pngPromises = [];

  let startTime = new Date();

  const currentSvgElements = document.querySelectorAll("svg.icon");

  for (const [index, svgElement] of currentSvgElements.entries()) {
    const pngDataObj = await convertSvgToPng(svgElement, index);
    pngPromises.push(pngDataObj);
  }

  try {
    const pngUrls = await Promise.all(pngPromises);
    let endTime = new Date();
    console.log("lcw time", endTime - startTime, pngUrls);

    const test = ssim(pngUrls[0].pngData, pngUrls[1].pngData);
    console.log(
      "lcw ssim",
      test,
      pngUrls[0].idx,
      pngUrls[1].idx,
      pngUrls[0].pngDataUrl,
      pngUrls[1].pngDataUrl
    );
  } catch (error) {
    console.error("lcw Error processing SVG elements:", error);
  }

  return true;
});

function convertSvgToPng(svgElement, index) {
  return new Promise((resolve, reject) => {
    var canvas = document.createElement("canvas");
    // var svgWidth = svgElement.clientWidth;
    // var svgHeight = svgElement.clientHeight;
    canvas.width = 36;
    canvas.height = 36;

    var svgData = new XMLSerializer().serializeToString(svgElement);
    var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(svgBlob);

    var img = new Image();
    img.onload = function () {
      var ctx = canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      var pngDataUrl = canvas.toDataURL("image/png");
      var pngData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);

      resolve({ idx: index, pngData: pngData, pngDataUrl: pngDataUrl });
    };

    img.onerror = function () {
      reject(new Error("Failed to load image for SVG element " + index));
    };

    img.src = url;
  });
}

async function loadAllSvgs() {
  const currentSvgElements = document.querySelectorAll("svg.icon");

  for (const [index, svgElement] of currentSvgElements.entries()) {
    const pngDataObj = await convertSvgToPng(svgElement, index);
    pngPromises.push(pngDataObj);
  }
}
