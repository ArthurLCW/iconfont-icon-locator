console.log("CONTENT testing", document.getElementById("testing"));

// chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
//   console.log("response", response, response.farewell);
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    "i am content",
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.greeting === "hello") sendResponse({ farewell: "goodbye123" });
});
