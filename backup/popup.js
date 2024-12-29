console.log("CONTENT testing", document.getElementById("testing"));
document.getElementById("highlightButton").addEventListener("click", () => {
  const svgCode = document.getElementById("svgInput").value;
  console.log("svgCode", svgCode);
  chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
    console.log("response in popup", response, response.farewell);
  });
  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //   console.log("tabs", tabs);
  //   chrome.tabs.sendMessage(tabs[0].id, {
  //     action: "highlight",
  //     svgCode: svgCode,
  //   });
  // });
});
