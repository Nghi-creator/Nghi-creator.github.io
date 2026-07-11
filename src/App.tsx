import { useState } from "react";
import { DesktopPage } from "./pages/DesktopPage";
import { LandingPage } from "./pages/LandingPage";
import { appIdFromPath } from "./data/profile";

function App() {
  const [hasEntered, setHasEntered] = useState(
    () => {
      const redirectRoute = new URLSearchParams(window.location.search).get("route");
      if (redirectRoute && appIdFromPath(`/${redirectRoute}`)) {
        window.history.replaceState({}, "", `/${redirectRoute}`);
        return true;
      }
      return appIdFromPath(window.location.pathname) !== null;
    },
  );

  function returnToWelcome() {
    window.history.replaceState({}, "", window.location.pathname);
    setHasEntered(false);
  }

  return hasEntered ? (
    <DesktopPage onBack={returnToWelcome} />
  ) : (
    <LandingPage onEnter={() => setHasEntered(true)} />
  );
}

export default App;
