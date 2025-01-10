import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import Home from "./components/home";
import Profile from "./components/Profile";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import ForgotPassword from "./components/auth/forgot-password";
import routes from "tempo-routes";
import AdminPage from "./components/Admin/AdminPage";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="fixed top-4 right-12 z-50">
        <Link to="/profile" className="p-2 rounded-full hover:bg-accent">
          <User className="w-12 h-12" />
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

export default App;
