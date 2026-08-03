import { useState } from "react";
import { DesktopPage } from "./pages/DesktopPage";
import { LandingPage } from "./pages/LandingPage";
import { appIdFromPath } from "./data/profile";
import { safeStorageGet, safeStorageSet } from "./lib/storage";

const VISITED_STORAGE_KEY = "creator-os-visited-v1";

function App() {
  const [hasEntered, setHasEntered] = useState(
    () => {
      const redirectRoute = new URLSearchParams(window.location.search).get("route");
      if (redirectRoute && appIdFromPath(`/${redirectRoute}`)) {
        window.history.replaceState({}, "", `/${redirectRoute}`);
        return true;
      }
      if (appIdFromPath(window.location.pathname) !== null) {
        return true;
      }

      return safeStorageGet(VISITED_STORAGE_KEY) === "1";
    },
  );

  function returnToWelcome() {
    window.history.replaceState({}, "", "/");
    setHasEntered(false);
  }

  function enterCreatorOS() {
    safeStorageSet(VISITED_STORAGE_KEY, "1");
    setHasEntered(true);
  }

  return hasEntered ? (
    <DesktopPage onBack={returnToWelcome} />
  ) : (
    <LandingPage onEnter={enterCreatorOS} />
  );
}

export default App;
