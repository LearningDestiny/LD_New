// /pages/enroll/index.jsx

import React, { useState } from 'react';
import EnrollmentForm from '@/EnrollPage/EnrollmentForm';

const EnrollPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const course = {
    title: "Your Course Title",
    price: "Rs100", // Example price; replace with actual course price
  };

  return (
    <div>
      {isOpen && <EnrollmentForm course={course} onClose={() => setIsOpen(false)} />}
    </div>
  );
}

export default EnrollPage;
