import { useState } from "react";
import { DesktopPage } from "./pages/DesktopPage";
import { LandingPage } from "./pages/LandingPage";

function App() {
  const [hasEntered, setHasEntered] = useState(
    () => new URLSearchParams(window.location.search).has("app"),
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
