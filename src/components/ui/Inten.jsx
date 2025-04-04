'use client'
import React, { useState } from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '../../components/landing-page'; // Importing the Header component

const internships = [
  {
    id: 1,
    title: 'Software Internship',
    company: 'Learning Destiny',
    stipend: '$500/month',
    imageUrl: '/SDIntern.png', // Replace with your image URL
    description: 'Join our team to work on exciting software projects and enhance your skills.',
    lastUpdated: 'Last updated: September 2024',
    duration: '3 months',
    responsibilities: ['Developing web applications', 'Collaborating with team members', 'Participating in code reviews'],
  },
  {
    id: 2,
    title: 'Digital Marketing Internship',
    company: 'Learning Destiny',
    stipend: '$300/month',
    imageUrl: '/DMIntern.png', // Replace with your image URL
    description: 'Gain hands-on experience in digital marketing strategies and social media management.',
    lastUpdated: 'Last updated: August 2024',
    duration: '6 months',
    responsibilities: ['Creating content for social media', 'Assisting in SEO strategies', 'Analyzing marketing data'],
  },
  {
    id: 3,
    title: 'Graphic Design Internship',
    company: 'Learning Destiny',
    stipend: '$400/month',
    imageUrl: '/GraphicIntern.png', // Replace with your image URL
    description: 'Work with our design team to create engaging visuals for various projects.',
    lastUpdated: 'Last updated: July 2024',
    duration: '4 months',
    responsibilities: ['Designing graphics for social media', 'Assisting in branding projects', 'Participating in brainstorming sessions'],
  },
];

const Internships = () => {
  const location = useSearchParams();
  const router = useRouter();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const [hoveredInternship, setHoveredInternship] = useState(null);

  // Filter internships based on the search query
  const filteredInternships = internships.filter(internship =>
    internship.title.toLowerCase().includes(searchQuery) ||
    internship.description.toLowerCase().includes(searchQuery)
  );

  const handleEnrollClick = (internshipId) => {
    router.push(`/apply/${internshipId}`);
  };

  // Inline styles for square card layout
  const cardStyles = {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
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
    backgroundColor: '#ffffff',
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-900 text-black-100">
      <Header /> {/* Using the Header component at the top */}

      {/* All Internships Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">All Internships</h2>
        {filteredInternships.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredInternships.map(internship => (
              <div
                key={internship.id}
                style={cardStyles}
                onMouseEnter={() => setHoveredInternship(internship.id)}
                onMouseLeave={() => setHoveredInternship(null)}
                className="transform transition duration-300 hover:scale-105"
              >
                <img src={internship.imageUrl} alt={internship.title} style={imageStyles} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '16px', background: 'rgba(0, 0, 0, 0.8)', width: '100%' }}>
                  <h4 className="font-semibold text-sm text-white">{internship.title}</h4>
                  <p className="text-xs text-gray-300">{internship.company}</p>
                  <p className="font-bold text-sm text-white mt-1">{internship.stipend}</p>
                </div>
                <div
                  style={hoveredInternship === internship.id ? hoveredCardOverlay : hiddenOverlay}
                >
                  <h4 className="font-semibold text-sm">{internship.title}</h4>
                  <p className="text-xs mt-1">{internship.lastUpdated}</p>
                  <p className="text-xs mt-2">{internship.duration}</p>
                  <p className="text-xs mt-2">{internship.description}</p>
                  <ul className="text-xs mt-2">
                    {internship.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-center mt-0">
                        <FaPlayCircle className="mr-1 text-blue-500" /> {responsibility}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleEnrollClick(internship.id)}
                    className="mt-4 py-2 px-4 w-full font-semibold rounded bg-black text-white hover:bg-blue-600 transition duration-300"
                    style={{ fontSize: '0.875rem' }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No internships found matching your search.</p>
        )}
      </section>
    </div>
  );
};

export default Internship;
