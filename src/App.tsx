import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import Home from "./components/home";
import Profile from "./components/Profile";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="fixed top-4 right-4 z-50">
        <Link to="/profile" className="p-3 rounded-full hover:bg-accent">
          <User className="w-8 h-8" />
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

export default App;
