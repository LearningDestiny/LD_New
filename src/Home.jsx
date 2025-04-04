import React from 'react';
import { useTheme } from './App';

function Aboutus() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`${isDarkMode ? ' text-white' : ' text-gray-900'} min-h-screen py-12 md:py-24 relative`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/HomeBG.png)`, // Use the public folder image
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div> {/* Blur and dark overlay */}
      </div>

      {/* Content Section */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-left mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in tracking-tight">
          Transforming Education, Shaping Careers.
          </h1>
          <p className="text-xl md:text-2xl font-light mb-4 max-w-3xl">
          We provide more than courses—we build communities, nurture talents, and create opportunities.
          </p>
          <a
            href="/aboutus"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full transition duration-300 mt-6 animate-bounce"
          >
            About Us
          </a>
          <span>          </span>
          <a
            href="/Login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full transition duration-300 mt-6 animate-bounce"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;


