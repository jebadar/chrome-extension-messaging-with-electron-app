chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Forward the message to the native application
  if (message.name == "native") {
    chrome.runtime.sendNativeMessage(
      'com.my_company.my_application',
      message.data,
      function (response) {
        sendResponse(response)
      }
    );
  } else if (message.name == "start") {
    chrome.storage.sync.set({ recordState: true });
  } else if (message.name == "stop") {
    chrome.storage.sync.set({ recordState: false });
    disableListener();
  }
  // Ensure sendResponse is not garbage collected
  return true;
});
function getRecordState() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["recordState"], (d) => {
      resolve(d["recordState"])
    })
  })
}
// toggle the tabs
function getPreviousTabId() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["activeId"], (d) => {
      resolve(d["activeId"]);
    })
  })
}
// Add event listener to listen for tab updates
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  // Check if the tab is active
  if (changeInfo.status === "complete" && tab.active) {
    // Do something with the active tab
    var t = await getPreviousTabId();
    if (t) disableListener()
    console.log("active", tab.id)
    chrome.storage.sync.set({ activeId: tab.id }, () => activeListener(tab.id))
  }
});

// Add event listener to listen for tab switching
chrome.tabs.onActivated.addListener(function (activeInfo) {
  // Get the details of the newly activated tab
  chrome.tabs.get(activeInfo.tabId, async function (tab) {
    // Do something with the newly activated tab
    var t = await getPreviousTabId();
    if (t) disableListener();
    chrome.storage.sync.set({ activeId: tab.id }, () => activeListener(tab.id))
    console.log("active 2", tab.id)
  });
});




// Define the listener function
async function onWebRequestCompleted(details) {
  var t = await getRecordState();
  if(t)
  chrome.runtime.sendNativeMessage(
    'com.my_company.my_application',
    { msg: "url", url: details.url },
    function (response) {
      console.log(response)
    }
  );
}

function activeListener(activeTabId) {
  // Add the listener only for the active tab
  chrome.webRequest.onCompleted.addListener(
    onWebRequestCompleted,
    { tabId: activeTabId, urls: ['https://*/*'] },
    ["responseHeaders"]
  );
}
// Function to disable listener on a specific tab
async function disableListener() {
  var t = await getPreviousTabId();
  if (t !== null) {
    chrome.webRequest.onCompleted.removeListener(onWebRequestCompleted);
  }
}
// chrome.runtime.sendNativeMessage(
//     'com.my_company.my_application',
//     { "msg": 1 },
//     function (response) {
//         debugger
//       console.log('Received ' + JSON.stringify(response));
//     }
//   );
// setTimeout(() => {
//   chrome.runtime.sendNativeMessage(
//     'com.my_company.my_application',
//     { "msg": "record" },
//     function (response) {
//       console.log(response)
//       chrome.runtime.sendMessage(response)
//     }
//   );
// }, 100)
