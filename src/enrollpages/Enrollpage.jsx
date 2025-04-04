'use client';
import React, { useState, useEffect } from 'react';
import { courses } from '../../src/Data';
import { getDatabase, ref, set } from 'firebase/database';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';

const EnrollPage = () => {
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Run this code only on the client side to get the courseId from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const courseId = params.get('courseId');
      const foundCourse = courses.find((c) => c.id === Number(courseId));
      setCourse(foundCourse);
    }
  }, []);

  // Handle case where course is not found
  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Course not found</h1>
      </div>
    );
  }

  // Handle registration click and save details to Firebase
  const handleRegisterClick = async () => {
    const db = getDatabase();
    const registrationRef = ref(db, `registrations/${course.id}/${phone}`);
    await set(registrationRef, {
      name,
      email,
      phone,
      courseId: course.id,
      courseTitle: course.title,
    });

    // Redirect to a confirmation page after successful registration
    router.push('/confirmation');
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
            className="w-full bg-blue-800 text-white py-3 rounded-lg mt-6 hover:bg-blue-900 transition duration-300 shadow-lg"
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
