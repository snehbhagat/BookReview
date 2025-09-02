import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";

function App() {
  // Replace with context/provider logic in a real app
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* More routes later */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;