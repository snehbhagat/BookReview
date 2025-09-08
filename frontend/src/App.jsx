import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import Discover from '@/pages/Discover';
import Home from '@/pages/Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handler = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <RootLayout isAuthenticated={isAuthenticated} user={user}>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/" element={<About />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/discover" element={<Discover />} />
      </Routes>
    </RootLayout>
  );
}

export default App;
