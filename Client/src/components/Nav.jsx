import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();

  // checking if user is logged in or not
  const user = JSON.parse(localStorage.getItem("user"));

  // logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="w-full bg-[#F4EBD3] py-4 px-6 text-[#2A1458] flex justify-between items-center">
      {/* Left/Center brand (hidden on small screens) */}
      <div className="text-xl font-bold sm:block hidden">
        Roadmap <span className="text-[#555879]">Hub</span>{" "}
      </div>

      {/* Right side links */}

      <div className="flex gap-4 justify-center sm:justify-end w-full sm:w-auto">
        {!user ? (
          <>
            <Link
              to="/login"
              className="text-sm sm:text-base font-medium hover:underline"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm sm:text-base font-medium hover:underline"
            >
              Signup
            </Link>
          </>
        ) : (
          <button
            className="text-sm sm:text-base font-medium hover:underline"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
