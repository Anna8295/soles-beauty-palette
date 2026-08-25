import { useRef, useState } from "react";
import Header from "./components/Header";
import StoryScene from "./components/StoryScene";
import Closing from "./components/Closing";
import DetailDrawer from "./components/DetailDrawer";

export default function App() {
  const headerRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  return (
    <div id="top" style={{ position: "relative", width: "100%" }}>
      <Header ref={headerRef} />

      <StoryScene headerRef={headerRef} onOpenProduct={setActiveId} />

      <Closing />

      <DetailDrawer activeId={activeId} onClose={() => setActiveId(null)} />
    </div>
  );
}
