import { Link } from "react-router-dom";

function Navbar({ isAuthenticated, user }) {
  return (
    <nav className="flex items-center justify-between p-4 bg-blue-800 text-white">
      <Link to="/" className="text-2xl font-bold">BookReview</Link>
      <div>
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="mr-4">Sign In</Link>
            <Link to="/register" className="bg-white text-blue-800 px-3 py-1 rounded">Sign Up</Link>
          </>
        ) : (
          <span className="mr-4">Hello, {user?.name}</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;