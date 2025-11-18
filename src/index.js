import { createRoot } from "@wordpress/element";
import domReady from "@wordpress/dom-ready";
import App from "./App";
import "./style.scss";

domReady(() => {
  const container = document.getElementById("media-manager-root");
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
});
