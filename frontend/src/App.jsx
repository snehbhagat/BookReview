import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import About from "./pages/About";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import Discover from '@/pages/Discover';
import Home from '@/pages/Home';
import BestSellersOverview from '@/pages/BestSellerOverview';
import BestSellerListPage from '@/pages/BestSellerListPage';
import BookDetail from '@/pages/BookDetail';
import Signup from "./pages/Signup";

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
        { <Route path="/about" element={<About />} /> }
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/best-sellers" element={<BestSellersOverview />} />
        <Route path="/best-sellers/list" element={<BestSellerListPage />} />
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>
    </RootLayout>
  );
}

export default App;
