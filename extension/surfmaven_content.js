const serverURL = 'http://localhost:5000';

const port = chrome.runtime.connect({ name: "userActivity" });
let accessCode = undefined;

let globalBehaviours = undefined;
let pageEventCount = 0;
let userActionsList = undefined;
let mouseMovementLimiter = 5;
let maxActionsHistoryLimit = 50;
let surfSystemReady = false
let userIpAddress = "";

// List of user events to track
const userEventsToTrack = [
  "click",
  "scroll",
  "keypress",
  "pageshow",
  "pagehide",
  "mouseenter",
  "mouseleave",
  "beforeunload",
  "chromeLostFocus",
  "chromeGainedFocus",
  "popstate"];

// Helper function to format the event details for logging
function formatEventDetails(event) {
  let eventDetails = `${event.counter} | ${new Date(event.preciseTime).toLocaleString()} | ${event.url} | ${event.type} | `;
  if (["click", "mouseenter", "mouseleave"].includes(event.type)) {
    eventDetails += `Target: ${event.target} | `;
  } else if (["keypress", "keydown"].includes(event.type)) {
    eventDetails += `Key: ${event.key} | `;
  } else if (["mousemove", "touchmove"].includes(event.type)) {
    eventDetails += `X: ${event.x} | Y: ${event.y} | `;
  } else if (["touchstart", "touchend"].includes(event.type)) {
    eventDetails += `Touches: | ${event.touches.map(touch => `ID: ${touch.identifier}, X: ${touch.x}, Y: ${touch.y}`).join(" | ")} | `;
  } else if (["scroll"].includes(event.type)) {
    eventDetails += `Scroll speed: ${event.scrollSpeed} | direction: ${event.scrollDirection} | position: ${event.scrollPosition} | `;
  } else if (["pageshow", "pagehide", "navigation"].includes(event.type)) {
    eventDetails += `Page visibility state: ${document.visibilityState} | `;
  } else {
    eventDetails += "No additional details available. | " + JSON.stringify(event);
  }
  return eventDetails;
}

// Fetches the data from the server
async function fetchBehaviourDefinitions() {
  try {
    const response = await fetch(serverURL + '/behaviours');

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    for (let bhKey in data) {
      let bh = data[bhKey];
      let jsonObj;

      try {
        jsonObj = JSON.parse(bh.json_definition);

      } catch (error) {
        jsonObj = null;
      }
      bh.json_definition = jsonObj
      bh.behavioursAsList = convertBehaviourJSONToList(jsonObj);
      console.log(bh.definition_name + " as List: ", bh.behavioursAsList);
    }

    globalBehaviours = data; // Assign the fetched data to the global object

  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

function getNodes(object) {
  return Object
    .entries(object)
    .map(([key, value]) => value && typeof value === 'object'
      ? { title: key, key, children: getNodes(value) }
      : { title: key, key, value }
    );
}

function convertBehaviourJSONToList(obj) {
  let list = [];

  if (typeof obj !== 'object' || obj === null) {
    return;
  }

  let current_node = new Map();
  for (const [key, value] of Object.entries(obj)) {
    if (!(key == 'children')) {
      {
        //console.log(`${key}:`, value);
        current_node.set(key, value);
      }
    }
  }

  if (current_node.get('type') != 'for') {
    list.push(current_node);
  }

  for (const [key, value] of Object.entries(obj)) {
    if (key == 'children') {
      let subListFromArray = [];

      let for_loop_count = 1;
      if (current_node.get('type') == 'for') {
        for_loop_count = current_node.get('for_count');
      }
      for (let i = 0; i < value.length; i++) {
        let subList = convertBehaviourJSONToList(value[i]);
        for (let s = 0; s < subList.length; s++)
          subListFromArray.push(subList[s]);
      }

      if (subListFromArray) { // append subListFromArray to list
        for (let r = 0; r < for_loop_count; r++) {
          for (let s = 0; s < subListFromArray.length; s++)
            list.push(subListFromArray[s]);
        }
      }

    }
  }
  return list;
}

function getBcurrent_nodeserVersion() {
  const userAgent = navigator.userAgent;
  let version = "";
  if (userAgent.indexOf("Chrome") > -1) {
    version = userAgent.match(/Chrome\/\d+/)[0].split("/")[1];
  }
  return version;
}

async function getUserIpAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    userIpAddress = data.ip;
  } catch (error) {
    console.error(error);
  }
}

// Fetch the behaviour definitions at the beginning
function readActionHistory() {
  const savedData = JSON.parse(localStorage.getItem('historicUserActions'));
  if (savedData) {
    userActionsList = savedData.userActions;
    if (userActionsList == undefined || userActionsList == null) {
      userActionsList = [];
    }

    for (let i = 0; i < userActionsList.length; i++)
      if (userActionsList[i].counter > pageEventCount)
        pageEventCount = userActionsList[i].counter;

    console.log('READ:', userActionsList.slice(0, 50));
  }
}

function sendToServerUserLog(logEntry) {
  let methodURL = serverURL + '/add-userlog';

  fetch(methodURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(logEntry)
  })
    .then(response => response.json())
    .then(data => {
    })
    .catch(error => {
      console.error('Error inserting record:', error);
    });

}

function checkMatchingForBehaviour(bhDef, userActionsList) {

  let foundMatch = false;

  let firstBhBlock = undefined;
  let firstStepOffset = 0;
  if (bhDef.behavioursAsList.length > 0) {
    let step = bhDef.behavioursAsList[0];
    if (step['type'] == 'behaviour')
      firstBhBlock = step;
    firstStepOffset = +1;
  }

  let stepsCount = firstBhBlock == undefined ? bhDef.behavioursAsList.length : bhDef.behavioursAsList.length - 1;
  let loopLength = Math.min(stepsCount, userActionsList.length);

  console.log(">>> CHECK FOR BEHAVIOUR ", bhDef.definition_name);

  let cnt = 0;
  for (let index = 0; index < loopLength; index++) {
    let step = bhDef.behavioursAsList[bhDef.behavioursAsList.length - index - 1];
    let action = userActionsList[userActionsList.length - index - 1];
    cnt++;
    console.log("Step ", cnt, ":", step);
    console.log("UserAction ", cnt, ":", action);

    // do comparing .......

  }
  console.log(">>> END OF BEHAVIOUR ", bhDef.definition_name);

  if (Math.random() < 0.1) {
    foundMatch = true;

  }

  if (foundMatch) {

    let logEntry = {
      definition_name: bhDef.definition_name,
      user_ip: userIpAddress,
      bcurrent_nodeser_type: 'Chrome' + '/' + getBcurrent_nodeserVersion(),
      current_url: window.location.href
    };

    sendToServerUserLog(logEntry);
  }

}

function process_event(event) {
  if (userActionsList == undefined || globalBehaviours == undefined)
    return;

  if (globalBehaviours) {
    for (let bhKey in globalBehaviours) {
      let bhDef = globalBehaviours[bhKey];

      checkMatchingForBehaviour(bhDef, userActionsList);
    }
  }
}

// content.js
function onDOMLoaded() {
  // Your function or method here
  console.log('The DOM is loaded in content script!');

  fetchBehaviourDefinitions();

  readActionHistory();

  getUserIpAddress();

  surfSystemReady = true;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDOMLoaded);
} else {
  onDOMLoaded();
}

// Toggle the visibility of developer mode elements
chrome.storage.local.get("surf_maven_developer_mode", (data) => {
  const developerMode = data.surf_maven_developer_mode || false;
  sendMessageToInjectedScript("toggleDivsVisibility", developerMode);
});

function saveUserActions() {
  const dataToSave = {
    userActions: userActionsList,
    // Add any other data you want to save
  };

  localStorage.setItem('historicUserActions', JSON.stringify(dataToSave));
}

// Listen for userActivity events
document.addEventListener("userActivity", (event) => {

  chrome.storage.local.get("surf_maven_developer_mode", (data) => {
    const developerMode = data.surf_maven_developer_mode || false;
    let event_msg = formatEventDetails(event.detail);
    if (developerMode) {
      sendMessageToInjectedScript("messageFromContent", "Surf-Maven log: " + event_msg);
    }
    console.log(event_msg);
  });

  if (userActionsList === undefined)
    userActionsList = [];

  if (!event.detail.skipEvent) {
    userActionsList.push(event.detail);

    if (userActionsList.length > maxActionsHistoryLimit) {
      const itemsToRemove = userActionsList.length - maxActionsHistoryLimit;
      userActionsList.splice(0, itemsToRemove);
    }

    saveUserActions();
  }
  process_event(event.detail);
});

// Sets the visibility of custom bottom div
chrome.storage.local.get("surf_maven_developer_mode", (data) => {
  const developerMode = data.surf_maven_developer_mode || false;
  customBottomDiv.style.display = developerMode ? "block" : "none";
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.action === "updateBottomText") {
    const updateBottomTextEvent = new CustomEvent("updateBottomText", {
      detail: request.text,
    });
    document.dispatchEvent(updateBottomTextEvent);
  }

  if (request.action === "toggleDivsVisibility") {
    sendMessageToInjectedScript("toggleDivsVisibility", request.visible);
  }
});

// Sends a message to the injected script
function sendMessageToInjectedScript(eventName, data) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

// Main function that initializes the content script
(function () {
  function sendUserActivity(data) {
    const event = new CustomEvent("userActivity", { detail: data });
    document.dispatchEvent(event);
  }

  let lastScrollTop = window.scrollY;
  let lastScrollLeft = window.scrollX;
  let lastMouseOverTarget = null;
  let lastScrollTime = Date.now();

  // Function to handle user events
  function handleEvent(eventType, event) {
    pageEventCount++;

    let time = Date.now(); // Add precise timestamp
    let eventData = {
      counter: pageEventCount,
      type: event.type,
      url: window.location.href,
      preciseTime: time,
      preciseTimeStr: new Date(time).toLocaleString(), // For debug only
      skipEvent: false
    };

    switch (eventType) {
      case "click":
      case "mouseenter":
      case "mouseleave":

        eventData.target = event.target;
        break;

      case "keypress":
        eventData.key = event.key;
        break;

      case "touchstart":
      case "touchend":
        eventData.touches = Array.from(event.changedTouches).map((touch) => ({
          identifier: touch.identifier,
          x: touch.clientX,
          y: touch.clientY,
        }));
        break;

      case "scroll":
        const scrollThreshold = 50;
        const currentTime = Date.now();
        const timeSinceLastScroll = currentTime - lastScrollTime;
        lastScrollTime = currentTime;

        const deltaY = window.scrollY - lastScrollTop;
        const deltaX = window.scrollX - lastScrollLeft;

        if (Math.abs(deltaY) < scrollThreshold && Math.abs(deltaX) < scrollThreshold) {
          return;
        }

        let scrollDirection = deltaY > 0 ? "down" : "up";
        let scrollSpeed;
        let scrollPosition;

        const viewportHeight = window.innerHeight;
        const scrollPercentage = Math.abs(deltaY) / viewportHeight;

        if (timeSinceLastScroll < 100 && scrollPercentage > 0.1) {
          scrollSpeed = "fast";
        } else if (timeSinceLastScroll < 250 && scrollPercentage > 0.05) {
          scrollSpeed = "normal";
        } else {
          scrollSpeed = "slow";
        }

        const documentHeight = document.documentElement.scrollHeight;
        const reachedTop = window.scrollY <= 0;
        const reachedBottom = window.scrollY + viewportHeight >= documentHeight;

        if (reachedTop) {
          scrollPosition = "reached_to_top";
        } else if (reachedBottom) {
          scrollPosition = "reached_to_end";
        } else {
          scrollPosition = "in_the_middle";
        }

        lastScrollTop = window.scrollY;
        lastScrollLeft = window.scrollX;

        eventData.viewportHeight = viewportHeight;
        eventData.documentHeight = documentHeight;
        eventData.scrollTop = window.scrollY;
        eventData.scrollLeft = window.scrollX;
        eventData.scrollDirection = scrollDirection;
        eventData.scrollSpeed = scrollSpeed;
        eventData.scrollPosition = scrollPosition;
        break;

      case "navigation":
        eventData.navigationType = event.type;
        break;

      case "chromeLostFocus":
        eventData.focusState = "lost";
        break;

      case "chromeGainedFocus":
        eventData.focusState = "gained";
        break;
      default: eventData.skipEvent = true
    }

    sendUserActivity(eventData);
  }

  // Add event listener for when Chrome loses focus
  window.addEventListener("blur", function (event) {
    handleEvent("chromeLostFocus", event);
  });

  // Add event listener for when Chrome gains focus
  window.addEventListener("focus", function (event) {
    handleEvent("chromeGainedFocus", event);
  });

  // Add event listeners for the user events
  userEventsToTrack.forEach((eventType) => {
    window.addEventListener(eventType, (event) => handleEvent(eventType, event));

    if (eventType === "popstate" || eventType === "beforeunload") {
      window.addEventListener(eventType, (event) => {
        handleEvent("navigation", event);
      });
    }
  });

  // Create a custom bottom div for logging
  const customBottomDiv = document.createElement("div");
  customBottomDiv.setAttribute("id", "customBottomDiv");
  customBottomDiv.style.cssText = "position: fixed; bottom: 0; left: 0; width: 100%; background-color: #51da4c; padding: 2px; z-index: 9999; display: none; color: black; font-size: 8pt;";
  customBottomDiv.innerText = "Surf-Maven log: ";
  document.body.appendChild(customBottomDiv);

  // Add event listeners for updating and toggling the custom bottom div

  document.addEventListener("messageFromContent", (event) => {
    customBottomDiv.innerText = event.detail;
  });

  // Event listener to toggle divs visibility
  document.addEventListener("toggleDivsVisibility", (event) => {
    customBottomDiv.style.display = event.detail ? "block" : "none";
  });

  window.addEventListener('beforeunload', (event) => {

    saveUserActions
    //console.log('WRITE:', userActionsList.slice(0, 10));
  });

})();
