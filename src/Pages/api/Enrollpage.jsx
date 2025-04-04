import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import data from '../../Data';
import { getDatabase, ref, set } from 'firebase/database';

const EnrollPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = course.find(c => c.id === Number(courseId));

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Course not found</h1>
      </div>
    );
  }

  const handleRegisterClick = async () => {
    const db = getDatabase();
    const registrationRef = ref(db, `registrations/${courseId}/${phone}`);
    await set(registrationRef, {
      name,
      email,
      phone,
      courseId,
      courseTitle: course.title,
    });

    // After saving to Firebase, you can use Firebase Cloud Functions to send SMS notification
    // Trigger the SMS sending function here

    navigate('/confirmation');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto py-12 px-6 flex-grow">
        <h2 className="text-4xl font-bold mb-8 text-center">{`Enroll in ${course.title}`}</h2>
        <div className="max-w-md mx-auto">
          <label className="block mb-4">
            <span className="text-gray-700">Name</span>
            <input
              type="text"
              className="form-input mt-1 block w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="form-input mt-1 block w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Phone</span>
            <input
              type="tel"
              className="form-input mt-1 block w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <button
            className="w-full bg-gray-800 text-white py-3 rounded-lg mt-6 hover:bg-gray-900 transition duration-300 shadow-lg"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EnrollPage;
