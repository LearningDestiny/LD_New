'use client';

import React, { useState, useEffect } from 'react';
import { events } from '../../src/Data';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import RegisterForm from '../enrollpages/RegisterForm';
import { Header } from '../components/landing-page';
import { useToast } from '../hooks/use-toast';
import { FaLink } from 'react-icons/fa';
import UserForm from "../components/ui/user-form"

const EventDetails = ({ id ,eventDetails }) => {
  const [event, setEvent] = useState(null || eventDetails);
  const [isFormVisible, setFormVisible] = useState(false); // State to toggle form visibility
  const [showIcons, setShowIcons] = useState(false);
  const router = useRouter();
  const { toast } = useToast();



  const handleRegisterNow = () => {
    setFormVisible(true); // Show the form
  };

  const handleCloseForm = () => {
    setFormVisible(false); // Hide the form
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

  if (!event) {
    return <div className="text-center text-white text-2xl mt-10">Loading event details...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-100 text-black">
      <Header />
      <div className="container mx-auto py-12 px-6 flex-grow">
        {/* Event Header */}
        <div className="flex flex-col items-center md:items-start md:justify-start text-center md:text-left border-b border-gray-700 pb-8 space-y-8 md:space-y-0">
          <div className="md:w-1/3 w-full h-64 flex justify-center md:justify-start">
            <img
              src={event.image || event.imageUrl}
              alt={event.title}
              className="rounded-lg shadow-lg object-cover"
              style={{ width: '100%', maxWidth: '450px' }}
            />
          </div>
          <div className="md:ml-8 w-full md:w-2/3 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-black">{event.title}</h2>
            <p className="mb-4 text-base md:text-lg text-black-300">{event.description}</p>
            <div className="flex items-center md:justify-start mb-2 text-black-300">
              <FaCalendarAlt className="mr-2 text-black" />
              <p>{event.date}</p>
            </div>
            <div className="flex md:justify-start mb-2 text-black-300">
              <FaMapMarkerAlt className="mr-2" />
              <p>{event.location}</p>
            </div>
            <div className="flex md:justify-start mb-2 text-black-300">
              <FaClock className="mr-2" />
              <p>{event.duration}</p>
            </div>
            <p className="text-lg text-black-300">
              <strong>Organizer:</strong> {event.organizer}
            </p>
            <div className="flex items-center space-x-4">
            <button
              className="mt-4 py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
              onClick={handleRegisterNow}
            >
              Enroll Now
            </button>
            <div className="relative inline-block mt-2">
              <button
                onClick={() => setShowIcons(!showIcons)}
                className="py-2 px-4 bg-transparent text-white border border-white rounded-full hover:text-black transition-colors duration-300"
                style={{ width: '60px', border: "2px solid black" }}
              >
                <img src="/share2.png" alt="Share" className="h-6 w-6 mx-auto" />
              </button>
              </div>

              {showIcons && (
                <div className="mt-4 flex space-x-4">
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

        {/* Event Highlights */}
        {
          event?.highlights && (
            <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-black">Event Highlights</h3>
          <ul className="list-disc list-inside text-lg ml-8 text-black-300 border-l-4 border-dotted border-indigo-500 pl-4">
            {event.highlights.map((highlight, index) => (
              <li key={index} className="mb-2">{highlight}</li>
            ))}
          </ul>
        </div>
          )
        }

        {/* Event Agenda */}
       {
          event?.agenda && 
          <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-black">Event Agenda</h3>
          <div className="space-y-8">
            { event.agenda.map((session, index) => (
              <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg border border-indigo-600">
                <h4 className="text-2xl font-bold mb-4 text-white">{session.time}</h4>
                <p className="text-xl font-semibold mb-3 text-white">{session.session}</p>
                <p className="text-lg text-gray-300"><em>Speaker: {session.speaker}</em></p>
              </div>
            ))}
          </div>
        </div>
       }
      </div>

      {/* Modal: EventForm */}
      {isFormVisible && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          // <RegisterForm event={event} onClose={handleCloseForm} />
           <UserForm 
                  feature="Event"
                  open={isFormVisible}
                  onClose={handleCloseForm}
                  onSubmit={() => {}}
                  data = {event}
                  />
        // </div>
      )}
    </div>
  );
};

export default EventDetails;