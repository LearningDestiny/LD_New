'use client';
import React, { useState } from 'react';
import { courses } from '../../src/Data';
import EnrollmentForm from './EnrollmentForm';
import { useRouter } from 'next/navigation';
import { Header } from '../components/landing-page';
import Loader from "../components/ui/loader"
import UserForm from "../components/ui/user-form";
import { FaLink, FaWhatsapp, FaInstagram, FaEnvelope, FaLinkedin } from 'react-icons/fa';

const CourseDetails = ({ params }) => {
  const courseId = params;
  const [course,setCourse] = useState({})
  const [loading,setLoading] = useState(true)
  const [isFormVisible, setFormVisible] = useState(false);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`); // Call API route
        if (!res.ok) throw new Error('Failed to fetch course');
        const data = await res.json();
        setCourse(data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    if (courseId) {
       fetchCourses();
    }
  }, []);
  // const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const router = useRouter();

  const handleEnrollNow = () => {
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnGmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(course.title)}&body=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(course.title)}`, '_blank');
  };

  if (loading) {
    return <Loader />;
  }


  return (
    <div className="flex flex-col min-h-screen bg-blue-100 text-black">
      <Header />
      <div className="container mx-auto py-12 px-6 flex-grow">
        {/* Course Header */}
        <div className="flex flex-col  items-start justify-center   border-b border-gray-700 pb-8">
          <div className="w-full  mb-8 md:mb-0 flex justify-center">
            <img
              src={course?.image || course?.imageUrl}
              alt={course?.title}
              className="rounded-lg shadow-lg object-cover"
              style={{ width: '100%', maxWidth: '450px' }}
            />
          </div>
          <div className="md:ml-8 flex-grow">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-black">{course?.title}</h2>
            <p className="mb-4 text-base md:text-lg text-black-300">{course?.description}</p>
            <p className="text-lg text-black-300"><strong>Instructor:</strong> {course?.instructor}</p>
            <p className="text-lg text-black-300"><strong>Duration:</strong> {course?.duration}</p>
            <p className="text-lg text-black-300"><strong>Lectures:</strong> {course?.lectureCount}</p>
            <p className="font-bold mt-6 text-2xl md:text-3xl text-black">{course?.price}</p>
            <div className="flex items-center space-x-4">
            <button
                className="mt-4 py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
                onClick={handleEnrollNow}
              >
                Enroll Now
              </button>
              <div className="relative inline-block">
                <button
                  onClick={() => setShowIcons(!showIcons)}
                  className="py-2 px-4 bg-transparent text-black border border-black rounded-full hover:text-black transition-colors duration-300"
                  style={{ width: "60px", border: "2px solid black" }}
                >
                  <img src="/share2.png" alt="Share" className="h-6 w-6 mx-auto" />
                </button>
              </div>

              {showIcons && (
                <div className="mt-2 flex space-x-4">
                  <button onClick={copyLink} className="text-black hover:text-gray-400">
                    <FaLink size={24} />
                  </button>
                  <button onClick={shareOnWhatsApp} className="hover:text-gray-400">
                    <img src="/whatsapp.png" alt="Share on WhatsApp" className="w-6 h-6" />
                  </button>
                  <button onClick={shareOnGmail} className="hover:text-gray-400">
                    <img src="/gmail.png" alt="Share on Gmail" className="w-6 h-6" />
                  </button>
                  <button onClick={shareOnLinkedIn} className="hover:text-gray-400">
                    <img src="/linkedin.png" alt="Share on LinkedIn" className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Course Highlights */}
        {
          course?.highlights && 
          <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-black">Course Highlights</h3>
          <ul className="list-disc list-inside text-lg ml-8 text-black-300 border-l-4 border-dotted border-indigo-500 pl-4">
            {course?.highlights.map((highlight, index) => (
              <li key={index} className="mb-2">{highlight}</li>
            ))}
          </ul>
        </div>
        }

        {/* Course Roadmap */}
        {
          course?.roadmap && 
          <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-black">Course Roadmap</h3>
          <div className="space-y-8">
            {course.roadmap.map((month, monthIndex) => (
              <div key={monthIndex} className="p-6 bg-gray-700 rounded-lg shadow-lg border border-indigo-600">
                <h4 className="text-2xl font-bold mb-4 text-white">{month?.month}</h4>
                {month.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="mb-6 text-white">
                    <h5 className="text-xl font-semibold mb-3 text-indigo-200">{week?.week}</h5>
                    <ul className="list-disc list-inside ml-6 text-lg text-gray-300">
                      {week.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="mb-1">{topic}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        }
      </div>
      {isFormVisible && <EnrollmentForm course={course} onClose={handleCloseForm} />}
      {isFormVisible && <UserForm data={course} onClose={handleCloseForm} feature="Course" open={isFormVisible} />}
    </div>
  );
};

export default CourseDetails;
