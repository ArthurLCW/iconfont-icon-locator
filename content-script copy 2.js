import ssim from "ssim.js";

let svgElements = [];
let pngDatas = [];
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
  loadAllSvgs(svgElements).then((res) => {
    pngDatas = res;
  });
  console.log("lcw settimeout", svgElements);
}, 3000);

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log("lcw listener", request, sender);
  let target;
  // if (request.type === "highlight") {
  //   const img = new Image();
  //   img.src = request.payload;
  //   img.onload = async function () {
  //     const canvas = document.createElement("canvas");
  //     canvas.width = 36;
  //     canvas.height = 36;
  //     var ctx = canvas.getContext("2d");
  //     ctx.setTransform(1, 0, 0, 1, 0, 0);
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     ctx.fillStyle = "#ffffff";
  //     ctx.fillRect(0, 0, canvas.width, canvas.height);
  //     ctx.drawImage(img, 0, 0);
  //     target = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //     console.log("图片的imageData:", target, pngDatas);

  //     /////
  //     sendResponse({ farewell: "goodbye" });
  //     if (pngDatas.length === 0) {
  //       pngDatas = await loadAllSvgs(svgElements);
  //     }
  //     console.log("lcw target", target);
  //     const similarities = [];
  //     for (const pngData of pngDatas) {
  //       // console.log("lcw iteration", pngData.pngData, target);
  //       similarities.push(ssim(pngData.pngData, target));
  //     }
  //     console.log("lcw ssim", similarities);
  //   };
  // }

  console.log("lcw pngDatas", { request, sender, pngDatas });

  const test = ssim(pngUrls[0].pngData, pngUrls[1].pngData);
  console.log(
    "lcw ssimold",
    test,
    pngUrls[0].idx,
    pngUrls[1].idx,
    pngUrls[0].pngDataUrl,
    pngUrls[1].pngDataUrl
  );

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

      // var pngDataUrl = canvas.toDataURL("image/png");
      var pngData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);

      resolve({ idx: index, pngData: pngData });
    };

    img.onerror = function () {
      reject(new Error("Failed to load image for SVG element " + index));
    };

    img.src = url;
  });
}

async function loadAllSvgs(svgElements) {
  let startTime = new Date();
  const pngPromises = [];
  // const currentSvgElements = document.querySelectorAll("svg.icon");
  const currentSvgElements = svgElements;

  for (const [index, svgElement] of currentSvgElements.entries()) {
    const pngDataObj = await convertSvgToPng(svgElement, index);
    pngPromises.push(pngDataObj);
  }
  let pageDatas = [];
  try {
    pageDatas = await Promise.all(pngPromises);
    let endTime = new Date();
    console.log("lcw time", endTime - startTime, pageDatas);
  } catch (error) {
    console.error("lcw Error processing SVG elements:", error);
  }

  return pageDatas;
}
