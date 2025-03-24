chrome.action.onClicked.addListener((tab) => {
  if (tab.url?.includes("youtube.com") && tab.id) {
    chrome.tabs.sendMessage(
      tab.id,
      { action: "toggle_extension" },
      (response) => {
        if (chrome.runtime.lastError) {
          // Silently ignore
        }
      }
    );
  } else {
    // Do nothing
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggle_extension") {
    if (sender.tab) {
      if (sender.tab?.id !== undefined) {
        chrome.tabs.sendMessage(sender.tab.id, { action: "toggle_extension" });
      }
    }

    sendResponse({ reply: "Toggled Extension" });
  }
});
