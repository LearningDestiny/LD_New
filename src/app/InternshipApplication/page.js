'use client';

import React, { useState, useRef } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../hooks/use-toast";

const InternshipApplication = (internship) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    internshiprole: internship.title,
    coverLetter: '',
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Allow only numbers in phone number field
    if (name === "phoneNumber" && !/^\d*$/.test(value)) return;
    setFormData(prevData => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const validateForm = () => {
    const { fullName, email, phoneNumber, resume } = formData;
    if (!fullName || !email || !phoneNumber || !resume) {
      toast({
        title: "Error",
        description: "Please fill all required fields and upload a resume.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    try {
    //  Step 1: Submit data to Google Sheets first
      const googleSheetsResponse = await fetch('/api/googleSheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          internshiprole: formData.internshiprole,
          coverLetter: formData.coverLetter,
        }),
      });

      if (!googleSheetsResponse.ok) {
        const errorData = await googleSheetsResponse.json();
        throw new Error(errorData.error || 'Failed to submit data to Google Sheets');
      }

      // Step 2: Upload to Google Drive
      const driveResponse = await fetch('/api/uploadToDrive', {
        method: 'POST',
        body: formDataObj,
      });

      if (!driveResponse.ok) {
        const errorData = await driveResponse.json();
        throw new Error(errorData.error || 'Failed to upload resume to Drive');
      }

      const driveData = await driveResponse.json();
      console.log('File ID:', driveData.fileId);

      toast({
        title: "Success",
        description: "Application submitted successfully!",
      });

      // Reset form data after successful submission
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        internshiprole: '',
        coverLetter: '',
        resume: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Internship Application</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">
            Full Name
          </label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium">
            Phone Number
          </label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))} // Only numbers
            required
          />
        </div>

        <div>
          <label htmlFor="internshiprole" className="block text-sm font-medium">
            Internship Role
          </label>
          <Input
            type="text"
            id="internshiprole"
            name="internshiprole"
            value={formData.internshiprole}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium">
            Cover Letter (Optional)
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border rounded-md border-input bg-background"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="resume" className="block text-sm font-medium">
            Resume
          </label>
          <Input
            type="file"
            id="resume"
            name="resume"
            onChange={handleChange}
            required
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </div>
  );
};

export default InternshipApplication;