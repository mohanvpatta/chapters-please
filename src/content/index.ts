import { mount, unmount } from "svelte";
import App from "../components/App.svelte";

import "./styles.css";

let app: ReturnType<typeof mount> | null = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggle_extension") {
    if (app) {
      // Unmount (Remove) the app if it exists
      console.log("Unmounting Chapters Please");
      unmount(app);
      app = null;
    } else {
      // Mount (Add) the app if it doesn't exist
      app = mount(App, { target: document.body });
      console.log("Mounting Chapters Please");
    }
  }
});
