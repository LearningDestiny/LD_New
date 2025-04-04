import React from 'react';
import { useNavigate } from 'react-router-dom';
import testing from '../assets/testing.png';

const CourseCard = ({ course, currentUser }) => {
  const navigate = useNavigate();

  const handleEnrollClick = () => {our
    navigate(`/admin-dashboard/course/${course.id}`);
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl"
      style={{
        maxWidth: '300px',  // Fixed width for the card
        minHeight: '450px', // Set a minimum height for the card to ensure a consistent layout
      }}
    >
      <div className="relative h-48 w-full overflow-hidden bg-black flex items-center justify-center"> {/* Container with center alignment */}
        <img
          src={course.imageUrl || testing}
          alt={course.title}
          className="w-full h-full object-contain"  // Ensures the entire image is visible without cropping
        />
      </div>
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-xl font-bold text-white truncate">{course.title}</h2> {/* Truncated title */}
          <p className="text-gray-400 mt-2 line-clamp-3">{course.description}</p> {/* Clamped description */}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <img
              src={currentUser?.photoURL || 'https://source.unsplash.com/40x40/?profile'}
              alt={currentUser?.displayName || 'Instructor'}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-300 text-sm ml-2 truncate">{course.instructorName || 'Instructor'}</span> {/* Truncated instructor name */}
          </div>
          <div className="text-gray-300 text-sm ml-2">
            ${course.price?.toFixed(2) || 'N/A'}
          </div>
        </div>
        <button
          onClick={handleEnrollClick}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none w-full transition-colors duration-300"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
