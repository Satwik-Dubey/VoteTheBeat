import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Session from "./pages/Session";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Session" element={<Session />} />
    </Routes>
  )
}

export default App
