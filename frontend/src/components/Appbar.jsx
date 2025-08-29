// frontend/src/components/Appbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./Blogcard";

export const AppBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Username");
    navigate("/signin"); // or "/signup" depending on your routes
  };

  return (
    <div className="py-2 border-b flex justify-between px-10 bg-white shadow-sm">
      <Link to={"/blogs"}>
        <div className="pt-2 text-2xl font-bold text-indigo-700">
          📓 Daily Journal
        </div>
      </Link>

      <div className="flex items-center space-x-4">
        <Link to={"/publish"}>
          <button
            type="button"
            className="text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
            focus:ring-4 focus:ring-indigo-300 font-medium rounded-full text-sm px-5 py-2.5 shadow"
          >
            Write Journal
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-full px-4 py-2 text-sm"
        >
          Logout
        </button>

        <Avatar name={localStorage.getItem("Username") || "U"} />
      </div>
    </div>
  );
};
