"use client"
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
 // Import the useAuth hook
 // Import Firebase auth
import logo from '../assets/logo.png'; // Assuming your image is located in this path

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useAuth(); // Destructure currentUser from useAuth

  // Toggle the mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white text-black p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Left section with logo */}
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
            <Link to="/" className="text-xl font-bold hover:text-blue-500">
              Learning Destiny Pvt. Ltd.
            </Link>
          </div>

          {/* Plain Text Links in the lower navbar */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/Aboutus" className="hover:text-blue-500">About Us</Link>
            <Link to="/Cour" className="hover:text-blue-500">Courses</Link>
            <Link to="/EVENTS" className="hover:text-blue-500">Events</Link>
            <Link to="/Workshops" className="hover:text-blue-500">Workshop</Link>
            <Link to="/internships" className="hover:text-blue-500">Internships</Link>
            {currentUser ? (
              <button onClick={handleLogout} className="hover:text-blue-500">
                Logout
              </button>
            ) : (
              <Link
                to="/Signup"
                className="bg-indigo-900 text-white px-4 py-2 rounded hover:bg-indigo-800"
              >
                Login / Sign Up
              </Link>
            )}
          </div>

          {/* Hamburger Icon for Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="focus:outline-none">
              {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white text-black p-4">
            <Link to="/Cour" className="block py-2 hover:text-blue-500" onClick={toggleMenu}>Courses</Link>
            <Link to="/EVENTS" className="block py-2 hover:text-blue-500" onClick={toggleMenu}>Event</Link>
            <Link to="/workshops" className="block py-2 hover:text-blue-500" onClick={toggleMenu}>Workshop</Link>
            <Link to="/internships" className="block py-2 hover:text-blue-500" onClick={toggleMenu}>Internships</Link>
            {currentUser ? (
              <button onClick={() => { handleLogout(); toggleMenu(); }} className="block py-2 hover:text-blue-500">
                Logout
              </button>
            ) : (
              <Link
                to="/Signup"
                className="block py-2 bg-indigo-900 text-white text-center rounded hover:bg-indigo-800"
                onClick={toggleMenu}
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

