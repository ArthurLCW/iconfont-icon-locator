// const script = document.createElement("script");
// script.src = "https://unpkg.com/ssim.js@v3.5.0/dist/ssim.web.js";
console.log("lcw", greet("lcw"));

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
// console.log(
//   "lcw content-script testing",
//   JSON.parse(JSON.stringify(svgElements))
// );
// chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
//   console.log("response", response, response.farewell);
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    "lcw i am content",
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension",
    svgElements
  );

  const pngs = [];
  const pngUrls = [];

  let time1 = new Date();
  for (let i = 0; i < svgElements.length; i++) {
    const svgElement = svgElements[i];
    // 创建一个canvas元素
    var canvas = document.createElement("canvas");
    var svgWidth = svgElement.clientWidth; // 获取SVG的宽度
    var svgHeight = svgElement.clientHeight; // 获取SVG的高度

    // 设置canvas的尺寸与SVG相同
    canvas.width = svgWidth;
    canvas.height = svgHeight;

    // 将SVG转换为XML字符串
    var svgData = new XMLSerializer().serializeToString(svgElement);

    // 创建一个SVG图像对象
    var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

    // 创建一个URL对象，指向SVG Blob
    var url = URL.createObjectURL(svgBlob);

    // 使用Image对象将SVG绘制到canvas上
    var img = new Image();
    img.onload = function () {
      // 清除canvas上的任何先前内容
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 将图像绘制到canvas上
      ctx.drawImage(img, 0, 0);

      // 将canvas内容转换为PNG数据URL
      var pngDataUrl = canvas.toDataURL("image/png");
      pngUrls.push(pngDataUrl);

      var pngData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      pngs.push(pngData);

      // （可选）在控制台中打印PNG数据URL
      // console.log("lcw pngData", i, pngDataUrl);

      // 释放URL对象
      URL.revokeObjectURL(url);
    };

    // 设置Image对象的src属性为SVG Blob的URL
    img.src = url;
  }
  let time2 = new Date();
  console.log(
    "lcw time",
    time2 - time1,
    JSON.parse(JSON.stringify(pngs)),
    pngUrls
  );

  // const test = ssim(pngs[0], pngs[1]);
  // console.log("test", test);

  // if (request.greeting === "hello") sendResponse({ farewell: "goodbye123" });
  return true;
});
