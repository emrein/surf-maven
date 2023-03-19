const serverURL = 'http://localhost:5000';

const port = chrome.runtime.connect({ name: "userActivity" });
let accessCode = undefined;

let globalBehaviours = undefined;
let pageEventCount = 0;
let userActionsList = undefined;
let mouseMovementLimiter = 5;
let maxActionsHistoryLimit = 250;
let surfSystemReady = false

// List of user events to track
const userEventsToTrack = [
  "click",
  //"mousemove",
  "scroll",
  "keypress",
  //"keydown",
  "pageshow",
  "pagehide",
  "mouseup",
  "mousedown",
  "mouseover",
  "mouseout",
  "mouseenter",
  "mouseleave",
  "focus",
  //"blur",
  "touchstart",
  //"touchmove",
  "touchend",
  "beforeunload",
  "popstate"];

// Helper function to format the event details for logging
function formatEventDetails(event) {
  let eventDetails = `${event.counter} | ${new Date(event.preciseTime).toLocaleString()} | ${event.url} | ${event.type} | `;
  if (["click", "mouseup", "mousedown", "mouseover", "mouseout", "mouseenter", "mouseleave", "focus", "blur"].includes(event.type)) {
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
    }

    globalBehaviours = data; // Assign the fetched data to the global object

  } catch (error) {
    console.error('Failed to fetch data:', error);
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
    //console.log('READ:', userActionsList.slice(0, 10));
  }
}

function check_for_matching(behaviour, userActionsList, parentKey = '') {
  const childrenArray = Object.entries(behaviour).map(([key, value]) => key);

  for (const [key, value] of Object.entries(behaviour)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof value === 'object') {
      check_for_matching(value, userActionsList, newKey);
    } else {
      const foundMatch = false;
      //console.log(`   Element key: ${newKey}, value: ${value}`);

      if (foundMatch) {
        console.log(`Match found for key: ${newKey}, value: ${value}`);
      }
    }
  }
}

function process_event(event) {
  if (userActionsList == undefined || globalBehaviours == undefined)
    return;

  console.log('processing the event #', pageEventCount);
  if (globalBehaviours) {
    for (let bhKey in globalBehaviours) {
      let bh = globalBehaviours[bhKey];

      let behaviour = bh.json_definition;
      //console.log('Checking for: ' + bh.definition_name);
      check_for_matching(behaviour, userActionsList);
    }
  }
}

// content.js
function onDOMLoaded() {
  // Your function or method here
  console.log('The DOM is loaded in content script!');

  fetchBehaviourDefinitions();

  readActionHistory();

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

  userActionsList.push(event.detail);

  if (userActionsList.length > maxActionsHistoryLimit) {
    const itemsToRemove = userActionsList.length - maxActionsHistoryLimit;
    userActionsList.splice(0, itemsToRemove);
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

    let eventData = {
      counter: pageEventCount,
      type: event.type,
      url: window.location.href,
      preciseTime: Date.now(), // Add precise timestamp
    };

    switch (eventType) {
      case "click":
      case "mouseup":
      case "mousedown":
      case "mouseover":
      case "mouseout":
      case "mouseenter":
      case "mouseleave":
      case "focus":
      case "blur":
        // Only proceed with mouseover and mouseout events if the target element has changed
        if ((eventType === "mouseover" || eventType === "mouseout") && event.target === lastMouseOverTarget) {
          return;
        }

        if (eventType === "mouseover" || eventType === "mouseout") {
          lastMouseOverTarget = event.target;
        }
        eventData.target = event.target;

        // Add the 'id' field if the target element has an 'id' attribute
        if (event.target.id) {
          eventData.id = event.target.id;
        }
        break;
      //case "keydown":
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

        eventData.scrollTop = window.scrollY;
        eventData.scrollLeft = window.scrollX;
        eventData.scrollDirection = scrollDirection;
        eventData.scrollSpeed = scrollSpeed;
        eventData.scrollPosition = scrollPosition;
        break;

      case "navigation":
        eventData.navigationType = event.type;
        break;
    }

    sendUserActivity(eventData);
  }

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
  customBottomDiv.style.cssText = "position: fixed; bottom: 0; left: 0; width: 100%; background-color: #51da4c; padding: 8px; z-index: 9999; display: none";
  customBottomDiv.innerText = "Surf-Maven log: ";
  document.body.appendChild(customBottomDiv);

  // Add event listeners for updating and toggling the custom bottom div
  document.addEventListener("messageFromContent", (event) => {
    // ... (omitted for brevity)
  });

  document.addEventListener("messageFromContent", (event) => {
    customBottomDiv.innerText = event.detail;
  });

  // Event listener to toggle divs visibility
  document.addEventListener("toggleDivsVisibility", (event) => {
    customBottomDiv.style.display = event.detail ? "block" : "none";
  });

  window.addEventListener('beforeunload', (event) => {
    const dataToSave = {
      userActions: userActionsList,
      // Add any other data you want to save
    };

    localStorage.setItem('historicUserActions', JSON.stringify(dataToSave));
    //console.log('WRITE:', userActionsList.slice(0, 10));
  });

})();
