'use client';

import React, { useState, useRef } from 'react';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

// Popup Component
const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
      <p className="text-black mb-4">{message}</p>
      <Button onClick={onClose}>Close</Button>
    </div>
  </div>
);

const GraduateRoleForm = ({ role, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // Only digits
    address: '',
    education: '',
    resume: null,
    coverLetter: '',
    roleName: role.title, // Pre-filled and disabled
  });
  const [popupMessage, setPopupMessage] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    // Ensure only digits for phone number
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.resume) {
      setPopupMessage('Please fill out all the required fields before enrolling.');
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    try {
      // Step 1: Submit data to Google Sheets
      const googleSheetsResponse = await fetch('/api/googleSheetg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          education: formData.education,
          roleName: formData.roleName,
          coverLetter: formData.coverLetter,
        }),
      });

      if (!googleSheetsResponse.ok) {
        throw new Error('Failed to submit data to Google Sheets');
      }

      // Step 2: Upload to Google Drive
      const driveResponse = await fetch('/api/uploadTodriveg', {
        method: 'POST',
        body: formDataObj,
      });

      if (!driveResponse.ok) {
        throw new Error('Failed to upload resume to Drive');
      }

      toast({ title: "Success", description: "Application submitted successfully!" });

      // Reset Form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        education: '',
        roleName: role.title, // Reset roleName
        resume: null,
        coverLetter: '',
      });

      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 p-4 overflow-auto">
      <style jsx>{`
        .formContainer {
          width: 100%;
          max-width: 500px;
          margin: auto;
        }
      `}</style>
      <div className="bg-background text-foreground  rounded-lg shadow-xl formContainer">
        <div className="px-4 py-3 border-b-2">
        <h2 className="text-xl font-bold ">Enroll for {role.title}</h2>
        </div>
        <form onSubmit={handleFormSubmit}>
           <div  className="max-h-[70vh] overflow-y-auto  p-4">
           {Object.keys(formData).map((key) => (
            <div key={key} className="mb-4">
              <Label htmlFor={key} className="block text-lg font-medium mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              {key === 'resume' ? (
                <Input
                  type="file"
                  id={key}
                  name={key}
                  ref={fileInputRef}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                  accept=".pdf,.doc,.docx"
                />
              ) : (
                <Input
                  type={key === 'phone' ? 'tel' : 'text'}
                  id={key}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                  disabled={key === 'roleName'}
                />
              )}
            </div>
          ))}
           </div>
          <div className="flex items-center justify-between px-4 py-3 border-t-2">
          <Button type="submit" className="">Submit</Button>
          <Button onClick={onClose}  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Close</Button>
          </div>
        </form>
       
      </div>
      {popupMessage && <Popup message={popupMessage} onClose={() => setPopupMessage('')} />}
    </div>
  );
};

export default GraduateRoleForm;
