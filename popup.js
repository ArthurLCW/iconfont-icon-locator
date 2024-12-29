console.log("CONTENT testing", document.getElementById("testing"));
// document.getElementById("highlightButton").addEventListener("click", () => {
//   const svgCode = document.getElementById("svgInput").value;
//   console.log("svgCode", svgCode);
//   // chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
//   //   console.log("response in popup", response, response.farewell);
//   // });
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     console.log("tabs", tabs);

//     chrome.tabs.sendMessage(
//       tabs[0].id,
//       { type: "highlight" },
//       function (response) {
//         console.log("response in popup", response, response.farewell);
//       }
//     );
//   });
// });
//////////////
const fileInput = document.getElementById("fileInput");
const processButton = document.getElementById("processButton");

fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "png") {
      alert("请上传PNG格式的图片！");
      return;
    }
  }
});

processButton.addEventListener("click", function () {
  console.log("lcw click");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("tabs", tabs);

        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "highlight", payload: event.target.result },
          function (response) {
            console.log("response in popup", response, response.farewell);
          }
        );
      });
    };
    reader.readAsDataURL(file);
  }
});
