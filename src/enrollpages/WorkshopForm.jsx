'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import PaymentHandlerButton from '../components/PaymentHandlerButton';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

// Popup Component
const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg text-center">
      <p className="text-white mb-4">{message}</p>
      <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white">Close</Button>
    </div>
  </div>
);

const EnrollmentForm = ({ course, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',// Contact field updated to accept only numbers
    stream: '',
    qualification: '',
    workshopName: course.title,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const { toast } = useToast();

  
 // Handles input change and ensures only numbers in contact field
 const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === 'contactNumber') {
    // Allow only numeric values
    const numericValue = value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, [name]: numericValue }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (Object.values(formData).some((value) => !value)) {
      setPopupMessage('Please fill out all the fields before enrolling.');
      return;
    }

    try {
      // Save data to Google Sheets (adjusted API path)
      const res = await fetch('/api/googleSheeta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        // Show payment button after saving data
        setShowPayment(true);
        toast({
          title: 'Data Saved',
          description: 'Your details have been saved. Please proceed with the payment.',
          variant: 'success',
        });
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save enrollment data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePaymentSuccess = () => {
    setIsSubmitted(true);
    setPopupMessage('Enrollment successful! Payment has been processed.');
  };

  const priceFloat = parseFloat(course.price.replace(/[^0-9.-]+/g, '').replace(',', ''));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
      <style jsx>{`
        .formContainer {
          width: 100%;
          max-width: 500px;
          margin: auto;
        }
          .text-black {
          color: black;
        }
      `}</style>
      <div className="bg-background text-foreground p-6 rounded-lg shadow-lg formContainer">
        {isSubmitted ? (
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl mb-4" />
            <h2 className="text-2xl font-bold">Thank you for enrolling!</h2>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Enroll in {course.title}</h2>
            <form onSubmit={handleFormSubmit}>
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <Label htmlFor={key} className="block text-lg font-medium mb-2 text-black-300">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                  <Input
                    type={key === 'contactNumber' ? 'tel' : 'text'}
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    pattern={key === 'contactNumber' ? '[0-9]*' : undefined} // Enforces only numbers
                    className="w-full bg-gray-800 text-white border-gray-700 focus:border-indigo-500"
                    required
                    disabled={key === 'workshopName'}
                  />
                </div>
              ))}
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Submit</Button>
            </form>
            <Button onClick={onClose} variant="ghost" className="mt-4 text-black-300 hover:text-white">
              Close
            </Button>
          </>
        )}
        {showPayment && (
          <div className="mt-4">
            <PaymentHandlerButton
              finalAmt={priceFloat}
              fullName={formData.name}
              email=""
              contact={formData.contactNumber}
              stream={formData.stream}
              qualification={formData.qualification}
              workshopName={formData.workshopName}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        )}
      </div>
      {popupMessage && <Popup message={popupMessage} onClose={() => setPopupMessage('')} />}
    </div>
  );
};

export default EnrollmentForm;

