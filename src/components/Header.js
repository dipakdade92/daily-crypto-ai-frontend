import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown, Book } from "lucide-react";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

    const userData = localStorage.getItem("user");

    const user = JSON.parse(userData);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-lg sticky top-0 z-10">
      {/* Logo/App title */}
      <div className="flex items-center">
        <Book className="h-7 w-7 text-indigo-600 mr-2" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          My Bookshelf
        </h1>
      </div>

      {/* User profile section */}
      <div className="relative">
        <div
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            {user.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>

          <div className="hidden md:block">
            <p className="font-medium text-gray-800">{user.name || "User"}</p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
              {user.email || "user@example.com"}
            </p>
          </div>

          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-100">
            <div className="px-4 py-2 border-b border-gray-100 md:hidden">
              <p className="font-medium text-gray-800">{user.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">
                {user.email || "user@gmail.com"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
