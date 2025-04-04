'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/landing-page';
import UserForm from "../../components/ui/user-form"
import { FaCalendarAlt, FaLink} from 'react-icons/fa';
import Link from "next/link";
import axios from 'axios';

const Careers = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [showIconsForRole, setShowIconsForRole] = useState(null);
  const [formEnabled,setFormEnabled] = useState(false)
  const [ jobDetails, setJobDetails] = useState({})

  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      const response = await axios.get('/api/careers');
      setJobPostings(response.data);
    } catch (error) {
      console.error('Error fetching job postings:', error);
    }
  };

  const handleShareClick = (jobId) => {
    setShowIconsForRole(showIconsForRole === jobId ? null : jobId);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnGmail = (jobTitle) => {
    window.open(`mailto:?subject=Check out this job opening: ${encodeURIComponent(jobTitle)}&body=${encodeURIComponent(window.location.href)}`,"_blank");
  };

  const shareOnLinkedIn = (roleTitle) => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(roleTitle)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-blue-100 text-gray-800">
      <Header />
      <header className="bg-blue-600 h-45 relative">
        <div className="absolute top-1/2 left-10 transform -translate-y-1/2 flex flex-col items-start z-10">
          <img
            src="/Transparent-Logo.png"
            alt="Learning Destiny Logo"
            width={250}
            height={300}
            className="w-40 h-45 mb-1"
          />
          <p className="text-white text-lg md:text-2xl font-semibold text-center px-4">
            "The future belongs to those who believe in the beauty of their dreams."
          </p>
        </div>
        <img
          src="https://www.cleo.com/sites/default/files/2023-12/Careers-Header-1%20%281%29.png"
          alt="Join Our Team"
          className="w-full h-full object-cover"
        />
      </header>

      <main className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Current Job Openings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobPostings.length > 0 ? (
              jobPostings.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:bg-gray-50"
                >
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <p className="mb-2"><strong>Location:</strong> {job.location}</p>
                  <p className="mb-2"><strong>Experience:</strong> {job.experience}</p>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaCalendarAlt className="w-5 h-5 mr-2 text-black-500" />
                    <p className="text-sm">{job.date}</p>
                  </div >
                  {/* <Link href={`/JobApplication?id=${job.id}`} passHref> */}
                    <button onClick={() => {setFormEnabled(true),setJobDetails(job)}} className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded transition-colors duration-300">
                      Apply Now
                    </button>
                  {/* </Link> */}
                  <div className="relative inline-block ml-40">
                  <button
                    onClick={() => handleShareClick(job.id)}
                    className="py-2 px-4 bg-transparent text-gray-900 border border-gray-900 rounded-full hover:text-black transition-colors duration-300"
                    style={{ width: "60px" }}
                  >
                    <img src="/share1.png" alt="Share" className="h-6 w-6 mx-auto" />
                  </button>
                  {showIconsForRole === job.id && (
                    <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <div className="py-2 px-4">
                        <button onClick={copyLink} className="flex items-center text-gray-900 hover:text-gray-600 mb-2">
                          <FaLink size={24} className="mr-2" />
                          Copy Link
                        </button>
                        <button onClick={shareOnWhatsApp} className="flex items-center text-gray-900 hover:text-gray-600 mb-2">
                          <img src="/whatsapp.png" alt="Share on WhatsApp" className="w-6 h-6 mr-2" />
                          WhatsApp
                        </button>
                        <button onClick={() => shareOnGmail(job.title)} className="flex items-center text-gray-900 hover:text-gray-600 mb-2">
                          <img src="/gmail.png" alt="Share on Gmail" className="w-6 h-6 mr-2" />
                          Gmail
                        </button>
                        <button onClick={() => shareOnLinkedIn(job.title)} className="flex items-center text-gray-900 hover:text-gray-600">
                          <img src="/linkedin.png" alt="Share on LinkedIn" className="w-6 h-6 mr-2" />
                          LinkedIn
                        </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            ))
            ) : (
              <p className="text-center col-span-3">No job postings available.</p>
            )}
          </div>
      </main>

       {/* Graduate Roles Section */}
       <section className="bg-blue-100 py-12">
        <div className="container mx-auto px-4 text-gray-800">
          <h2 className="text-3xl font-bold text-center mb-6">Graduate Roles</h2>
          <p className="text-center text-lg mb-8">
            Start your career with exciting roles tailored for fresh graduates. Explore opportunities to grow and make an impact.
          </p>
          
          {/* Introduction Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mb-8">
            <h3 className="text-2xl font-semibold mb-4">Why Join Us?</h3>
            <p className="text-gray-600 mb-4">
              As a fresh graduate, you'll work on real-world projects, collaborate with industry experts, and unlock your potential with our supportive team.
            </p>
            <a href="/graduate-roles" className="text-blue-600 hover:underline font-bold">
              View Available Roles &rarr;
            </a>
          </div>
          </div>
      </section>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025 Learning Destiny Pvt Ltd. All rights reserved.</p>
      </footer>
      {
        formEnabled && <UserForm open ={formEnabled} onClose={()=>setFormEnabled(false)} data={jobDetails} feature="Professional Career"/>
      }
    </div>
  );
};

export default Careers;