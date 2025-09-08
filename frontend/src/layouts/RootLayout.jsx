import Navbar from "../components/home/Navbar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children, isAuthenticated, user }) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} user={user} />
      <main className="flex-1">
        <div className="container py-8">{children}</div>
      </main>
      <footer className="border-t">
        <div className="container py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} BookReview. All rights reserved.
        </div>
      </footer>
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
    </div>
  );
}