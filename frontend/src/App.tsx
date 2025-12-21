import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Session from "./pages/Session";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/session/:id" element={<Session />} />
    </Routes>
  )
}

export default App
