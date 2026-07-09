import { useState } from "react";
import { DesktopPage } from "./pages/DesktopPage";
import { LandingPage } from "./pages/LandingPage";

function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return hasEntered ? (
    <DesktopPage onBack={() => setHasEntered(false)} />
  ) : (
    <LandingPage onEnter={() => setHasEntered(true)} />
  );
}

export default App;
