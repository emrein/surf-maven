chrome.runtime.sendMessage({ message: 'activate_extension' });

document.addEventListener("DOMContentLoaded", function () {

  const developerModeCheckbox = document.getElementById("developerMode");
  // Load the current state of the developer mode from local storage
  chrome.storage.local.get("surf_maven_developer_mode", (data) => {
    let checked = data.surf_maven_developer_mode || false;
    developerModeCheckbox.checked = checked;
    toggleDivsVisibility(checked);
  });

  // Save the state of the developer mode to local storage when the checkbox is changed
  developerModeCheckbox.addEventListener("click", () => {
    chrome.storage.local.set({ surf_maven_developer_mode: developerModeCheckbox.checked });

    toggleDivsVisibility(developerModeCheckbox.checked);
  });

});

function toggleDivsVisibility(visible) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('in popup, toggle:', visible);
    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleDivsVisibility", visible: visible });
  });
}
