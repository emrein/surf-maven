function injectScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["injection.js"],
  });
}

chrome.webNavigation.onCompleted.addListener(
  ({ tabId }) => {
    injectScript(tabId);
  },
  { url: [{ urlPrefix: "http://" }, { urlPrefix: "https://" }] }
);

chrome.webNavigation.onHistoryStateUpdated.addListener(
  ({ tabId }) => {
    injectScript(tabId);
  },
  { url: [{ urlPrefix: "http://" }, { urlPrefix: "https://" }] }
);

chrome.webNavigation.onDOMContentLoaded.addListener(
  ({ tabId }) => {
    injectScript(tabId);
  },
  { url: [{ urlPrefix: "http://" }, { urlPrefix: "https://" }] }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    injectScript(tabId);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id) {
      chrome.storage.local.set({ surf_maven_user_code: '' }, () => {
        console.log('Init tracking...');
    });
      injectScript(tabs[0].id);
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'activate_extension') {


    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        injectScript(tabs[0].id);
      }
    });
  }
});