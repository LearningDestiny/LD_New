'use client'
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';

const workshops = [
  {
    id: 1,
    title: 'Full Stack Web Development Workshop',
    instructor: 'Jane Doe',
    price: '$49',
    imageUrl: '/WebDevPoster.png', // Replace with your image URL
    description: 'A workshop to enhance your Website Development Skills.',
    lastUpdated: 'Last updated: September 2024',
    duration: '3 hours',
    lectureCount: 5,
    highlights: ['Interactive sessions', 'Expert feedback', 'Networking opportunities'],
  },
  {
    id: 2,
    title: 'Data Analysis with Python Workshop',
    instructor: 'John Smith',
    price: '$59',
    imageUrl: 'DataAnalysisPoster.png', // Replace with your image URL
    description: 'Learn the fundamentals of Data Analysis with Python in this hands-on workshop.',
    lastUpdated: 'Last updated: August 2024',
    duration: '4 hours',
    lectureCount: 6,
    highlights: ['Practical exercises', 'Portfolio building', 'Q&A session'],
  },
  {
    id: 3,
    title: 'Digital Marketing Bootcamp',
    instructor: 'Emily Johnson',
    price: '$79',
    imageUrl: 'https://via.placeholder.com/200', // Replace with your image URL
    description: 'An intensive workshop covering the latest digital marketing strategies.',
    lastUpdated: 'Last updated: July 2024',
    duration: '5 hours',
    lectureCount: 8,
    highlights: ['Hands-on projects', 'Real-world case studies', 'Certification'],
  },
];

const Workshop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const [hoveredWorkshop, setHoveredWorkshop] = useState(null);

  // Filter workshops based on the search query
  const filteredWorkshops = workshops.filter(workshop =>
    workshop.title.toLowerCase().includes(searchQuery) ||
    workshop.description.toLowerCase().includes(searchQuery)
  );

  const handleEnrollClick = (workshopId) => {
    navigate(`/enroll/${workshopId}`);
  };

  // Inline styles for square card layout
  const cardStyles = {
    position: 'relative',
    width: '100%',
    paddingTop: '75%', // Aspect ratio for square
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Light shadow for card
    border: '2px solid #3b82f6', // Light blue border
  };

  const imageStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const hoveredCardOverlay = {
    position: 'absolute',
    inset: 0,
    padding: '16px',
    backgroundColor: '#fff', // White background for overlay
    opacity: 1,
    zIndex: 10,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const hiddenOverlay = {
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: -1,
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8" style={{ backgroundColor: '#D1E7F2', color: '#000' }}> {/* Light blue background */}
      
      {/* All Workshops Section */}
      <section>
        <h2 className="text-4xl font-bold mb-8 text-center">All Workshops</h2>
        {filteredWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredWorkshops.map(workshop => (
              <div
                key={workshop.id}
                style={cardStyles}
                onMouseEnter={() => setHoveredWorkshop(workshop.id)}
                onMouseLeave={() => setHoveredWorkshop(null)}
              >
                <img src={workshop.imageUrl} alt={workshop.title} style={imageStyles} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '16px', background: 'rgba(0, 0, 0, 0.8)', width: '100%' }}>
                  <h4 className="font-semibold text-sm text-white">{workshop.title}</h4>
                  <p className="text-xs text-gray-300">{workshop.instructor}</p>
                  <p className="font-bold text-sm text-white mt-1">{workshop.price}</p>
                </div>
                <div
                  style={hoveredWorkshop === workshop.id ? hoveredCardOverlay : hiddenOverlay}
                >
                  <h4 className="font-semibold text-sm">{workshop.title}</h4>
                  <p className="text-xs mt-1">{workshop.lastUpdated}</p>
                  <p className="text-xs mt-2">{workshop.duration} total hours Â· {workshop.lectureCount} lectures Â· All Levels</p>
                  <p className="text-xs mt-2">{workshop.description}</p>
                  <ul className="text-xs mt-2">
                    {workshop.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center mt-0">
                        <FaPlayCircle className="mr-1 text-blue-500" /> {highlight}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleEnrollClick(workshop.id)}
                    className="mt-4 py-2 px-4 w-full font-semibold rounded bg-black text-white hover:bg-blue-600 transition duration-300"
                    style={{ fontSize: '0.875rem' }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No workshops found matching your search.</p>
        )}
      </section>
    </div>
  );
};

export default Workshop;
