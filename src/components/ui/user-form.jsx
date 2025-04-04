"use client";
import { useState, useEffect } from "react";
import IndiaStateCity from "../../../public/IndiaStateCity.json";
import { useToast } from "../../hooks/use-toast";
import UserPaymentBtn from "./user-payment-btn";
const processStateCityData = (data) => {
  const stateMap = {};

  data.forEach((item) => {
    if (!stateMap[item.state]) {
      stateMap[item.state] = [];
    }
    stateMap[item.state].push(item.city);
  });

  const states = Object.keys(stateMap).sort();

  return {
    states,
    stateMap,
  };
};
const rephraseAmount = (price)=> {
  return parseFloat(price.replace(/[^0-9.-]+/g, '').replace(',', ''))
}
const FormDialog = ({ feature, open, onClose, data }) => {
  const highestQualifications = [
    "Below 10th",
    "10th Pass (Secondary School Certificate)",
    "12th Pass (Higher Secondary Certificate)",
    "Diploma",
    "ITI (Industrial Training Institute)",
    "Bachelor's Degree (e.g., BA, BSc, BCom)",
    "Bachelor of Engineering (BE)",
    "Bachelor of Technology (BTech)",
    "Bachelor of Science (BSc)",
    "Bachelor of Commerce (BCom)",
    "Bachelor of Arts (BA)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Computer Applications (BCA)",
    "Bachelor of Education (BEd)",
    "Bachelor of Architecture (BArch)",
    "Bachelor of Pharmacy (BPharm)",
    "Bachelor of Laws (LLB)",
    "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
    "Bachelor of Dental Surgery (BDS)",
    "Bachelor of Ayurvedic Medicine and Surgery (BAMS)",
    "Bachelor of Homeopathic Medicine and Surgery (BHMS)",
    "Bachelor of Veterinary Science (BVSc)",
    "Bachelor of Physiotherapy (BPT)",
    "Bachelor of Science in Nursing (BSc Nursing)",
    "Master's Degree (e.g., MA, MSc, MCom)",
    "Master of Engineering (ME)",
    "Master of Technology (MTech)",
    "Master of Science (MSc)",
    "Master of Commerce (MCom)",
    "Master of Arts (MA)",
    "Master of Business Administration (MBA)",
    "Master of Computer Applications (MCA)",
    "Master of Education (MEd)",
    "Master of Architecture (MArch)",
    "Master of Pharmacy (MPharm)",
    "Master of Laws (LLM)",
    "Master of Surgery (MS)",
    "Doctor of Medicine (MD)",
    "Master of Dental Surgery (MDS)",
    "Master of Veterinary Science (MVSc)",
    "Master of Physiotherapy (MPT)",
    "Master of Science in Nursing (MSc Nursing)",
    "Doctor of Philosophy (PhD)",
    "Doctor of Science (DSc)",
    "Post Graduate Diploma",
    "Chartered Accountant (CA)",
    "Company Secretary (CS)",
    "Cost and Management Accountant (CMA)",
    "Certified Financial Planner (CFP)",
    "Certified Public Accountant (CPA)",
    "Fellow of Chartered Accountants (FCA)",
    "Fellow of Company Secretaries (FCS)",
    "Fellow of Cost and Management Accountants (FCMA)",
    "Others",
  ];

  const { toast } = useToast();

  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [amount,setAmount] = useState(0)

  // state and city handling
  const [stateCityData, setStateCityData] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);



  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    handleChange(e);
  };

  // ## State and city handling

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {

   

    e.preventDefault();
    let finalData = {
      ...formData,
      ...(file && { resume: file.name }),
    };

    if (file && file.size > 1024 * 1024) {
      alert("File size should not be greater than 1MB");
      return;
    }
    // Handle submission based on feature
    switch (feature) {
      case "Course":
        try {
          finalData = {
            ...formData,
            courseName: data?.title,
            courseDescription: data?.description,
            courseId: data?.id,
            coursePrice: data?.price,
            courseInstructor: data?.instructor,
            stream: formData?.stream,
            highestQualification: formData?.highestQualification,
            dob: formData?.dob,
            courseUrl: `enroll/${data?.id}`,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            state: formData.state,
            country: "India", // You should get this from your auth system or generate it
            ...(file && { resume: file.name }),
          };
          const response = await fetch("/api/form/courses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(finalData),
          });

          const result = await response.json();

          if (result.success) {
            
            setUserId(result.data.userId);
            setItemId(result.data.id);
            toast({
              title: 'Data Saved',
              description: 'Your details have been saved. Please proceed with the payment.',
              variant: 'success',
            });
            
            let getPrice = await rephraseAmount(data.price)
            if (getPrice <= 0) {
              setPaymentEnabled(false);  
              onClose();
            }
            else {
              setPaymentEnabled(true);
              setAmount(getPrice)
              setPaymentConfig({
                amount: data.price, // from your course/event data
                feature: feature.toLowerCase(), // 'course', 'event', etc.
                submissionId: result.data.id,
                itemId: data.id,
                userId: result.data.userId,
                userDetails: {
                  fullName: formData.fullName,
                  email: formData.email,
                  phone: formData.phone,
                  city: formData.city,
                  state: formData.state,
                  country: "India",
                  steam: formData.stream,
                  highestQualification: formData.highestQualification,
                  dob: formData.dob
  
                }
              });
            }
            
           
            // onClose();
          } else {
            throw new Error(result.error || "Failed to submit form");
          }
        } catch (error) {
          console.error("Submission error:", error);
          alert(`Error submitting form: ${error.message}`);
        }
        break;
      case "Event":
        try {
          finalData = {
            ...formData,
            eventName: data?.title,
            eventDescription: data?.description,
            eventId: data?.id,
            eventPrice: data?.price,
            eventOrganizer: data?.organizer,
            eventLocation: data?.location,
            stream: formData?.stream,
            highestQualification: formData?.highestQualification,
            dob: formData?.dob,
            eventUrl: `event/${data?.id}`,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            state: formData.state,
            country: "India", // You should get this from your auth system or generate it
            source: formData?.source,
            ...(file && { resume: file.name }),
          };
          const response = await fetch("/api/form/events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(finalData),
          });

          const result = await response.json();

          if (result.success) {
            
            setUserId(result.data.userId);
            setItemId(result.data.id);
            toast({
              title: 'Data Saved',
              description: 'Your details have been saved. Please proceed with the payment.',
              variant: 'success',
            });
            let getPrice = await rephraseAmount(data.price)
            if(getPrice <= 0){
              setPaymentStatus(false);
              onClose()
            }
            else{
              setPaymentEnabled(true); 
           
              setAmount(getPrice)
              setPaymentConfig({
                amount: data.price, 
                feature: feature.toLowerCase(), 
                submissionId: result.data.id,
                itemId: data.id,
                userId: result.data.userId,
                userDetails: {
                  fullName: formData.fullName,
                  email: formData.email,
                  phone: formData.phone,
                  city: formData.city,
                  state: formData.state,
                  country: "India",
                  steam: formData.stream,
                  highestQualification: formData.highestQualification,
                  dob: formData.dob,
                  source: formData?.source
  
                }
              });
            }
            
            // onClose();
          } else {
            throw new Error(result.error || "Failed to submit form");
          }
        } catch (error) {
          console.error("Submission error:", error);
          alert(`Error submitting form: ${error.message}`);
        }
        break;
      case "Workshop":
        try {
          finalData = {
            ...formData,
            workshopName: data?.title,
            workshopDescription: data?.description,
            workshopId: data?.id,
            workshopPrice: data?.price,
            workshopInstructor: data?.instructor,
            stream: formData?.stream,
            highestQualification: formData?.highestQualification,
            dob: formData?.dob,
            workshopUrl: `workshops/${data?.id}`,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            state: formData.state,
            country: "India", // You should get this from your auth system or generate it
            source: formData?.source,
            ...(file && { resume: file.name }),
          };
          const response = await fetch("/api/form/workshops", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(finalData),
          });

          const result = await response.json();

          if (result.success) {
            
            setUserId(result.data.userId);
            setItemId(result.data.id);
            toast({
              title: 'Data Saved',
              description: 'Your details have been saved. Please proceed with the payment.',
              variant: 'success',
            });
            let getPrice = await rephraseAmount(data.price)
            if(getPrice <= 0 ){
              setPaymentEnabled(false);
              onClose();
            }
            else{

              setPaymentEnabled(true); 
              setAmount(getPrice)
              setPaymentConfig({
                amount: data.price, 
                feature: feature.toLowerCase(), 
                submissionId: result.data.id,
                itemId: data.id,
                userId: result.data.userId,
                userDetails: {
                  fullName: formData.fullName,
                  email: formData.email,
                  phone: formData.phone,
                  city: formData.city,
                  state: formData.state,
                  country: "India",
                  steam: formData.stream,
                  highestQualification: formData.highestQualification,
                  dob: formData.dob,
                  source : formData.source
  
                }
              });

            }

            // onClose();
          } else {
            throw new Error(result.error || "Failed to submit form");
          }
        } catch (error) {
          console.error("Submission error:", error);
          alert(`Error submitting form: ${error.message}`);
        }
        break;
      case "Internship":
        try {
          const sendData = new FormData();
          
          // Add all text fields
          sendData.append("fullName", formData.fullName);
          sendData.append("email", formData.email);
          sendData.append("phone", formData.phone);
          sendData.append("state", formData.state);
          sendData.append("city", formData.city);
          sendData.append("university", formData.university);
          sendData.append("graduationYear", formData.graduationYear);
          sendData.append("linkedin", formData.linkedin || "");
          sendData.append("portfolio", formData.portfolio || "");
          sendData.append("coverLetter", formData.coverLetter || "");
          sendData.append("dob", formData.dob);
          sendData.append("internshipName", data?.title);
          sendData.append("internshipDescription", data?.description);
          sendData.append("internshipLocation", data?.location);
          sendData.append("internshipId", data?.id);
          sendData.append("internshipUrl",`internship/${data?.id}`);
          
          // Add file if exists
          if (file) {
            sendData.append("resume", file);
          }
      
          const response = await fetch("/api/form/internships", {
            method: "POST",
            body: sendData, // No Content-Type header for FormData
          });
      
          const result = await response.json();
      
          if (result.success) {
            toast({
              title: 'Application Submitted',
              description: 'Your internship application has been submitted successfully!',
              variant: 'success',
            });
            onClose();
          } else {
            throw new Error(result.error || "Failed to submit application");
          }
        } catch (error) {
          console.error("Submission error:", error);
          toast({
            title: 'Error',
            description: error.message || 'Failed to submit application',
            variant: 'destructive',
          });
        }
        break;
      case "Graduate Career":
        try {
          const sendData = new FormData();
          
          // Add all text fields
          sendData.append("fullName", formData.fullName);
          sendData.append("email", formData.email);
          sendData.append("phone", formData.phone);
          sendData.append("state", selectedState);
          sendData.append("city", formData.city);
          sendData.append("university", formData.university);
          sendData.append("graduationYear", formData.graduationYear);
          sendData.append("highestQualification", formData.highestQualification);
          sendData.append("linkedin", formData.linkedin || "");
          sendData.append("portfolio", formData.portfolio || "");
          sendData.append("coverLetter", formData.coverLetter || "");
          sendData.append("dob", formData.dob);
          sendData.append("expectedSalary", formData.expectedSalary);
          sendData.append("availableStartDate", formData.availableStartDate);
          sendData.append("source", formData.source);
          sendData.append("graduateCareerName", data?.title);
          sendData.append("graduateCareerDescription", data?.description);
          sendData.append("graduateCareerLocation", data?.location);
          sendData.append("graduateCareerId", data?.id);
          
          // Add file if exists
          if (file) {
            sendData.append("resume", file);
          }
      
          const response = await fetch("/api/form/graduate", {
            method: "POST",
            body: sendData,
          });
      
          const result = await response.json();
      
          if (result.success) {
            toast({
              title: 'Application Submitted',
              description: 'Your graduate career application has been submitted successfully!',
              variant: 'success',
            });
            onClose();
          } else {
            throw new Error(result.error || "Failed to submit application");
          }
        } catch (error) {
          console.error("Submission error:", error);
          toast({
            title: 'Error',
            description: error.message || 'Failed to submit application',
            variant: 'destructive',
          });
        }
        // Add your graduate career submission logic here
        break;
      case "Professional Career":
        try {
          const sendData = new FormData();
          
          // Add all text fields
          sendData.append("fullName", formData.fullName);
          sendData.append("email", formData.email);
          sendData.append("phone", formData.phone);
          sendData.append("state", selectedState);
          sendData.append("city", formData.city);
          sendData.append("experience", formData.experience);
          sendData.append("employer", formData.employer || "");
          sendData.append("skills", formData.skills);
          sendData.append("linkedin", formData.linkedin || "");
          sendData.append("portfolio", formData.portfolio || "");
          sendData.append("coverLetter", formData.coverLetter || "");
          sendData.append("dob", formData.dob);
          sendData.append("expectedSalary", formData.expectedSalary);
          sendData.append("availableStartDate", formData.availableStartDate);
          sendData.append("source", formData.source);
          sendData.append("professionalCareerName", data?.title);
          sendData.append("professionalCareerDescription", data?.description);
          sendData.append("professionalCareerLocation", data?.location);
          sendData.append("professionalCareerId", data?.id);
          
          // Add file if exists
          if (file) {
            sendData.append("resume", file);
          }
      
          const response = await fetch("/api/form/professional", {
            method: "POST",
            body: sendData,
          });
      
          const result = await response.json();
      
          if (result.success) {
            toast({
              title: 'Application Submitted',
              description: 'Your professional career application has been submitted successfully!',
              variant: 'success',
            });
            onClose();
          } else {
            throw new Error(result.error || "Failed to submit application");
          }
        } catch (error) {
          console.error("Submission error:", error);
          toast({
            title: 'Error',
            description: error.message || 'Failed to submit application',
            variant: 'destructive',
          });
        }
        break;
      default:
        break;
    }

    // onClose();
  };

  const renderFormFields = () => {
    switch (feature) {
      case "Course":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Course Name </label>
              <input
                type="text"
                name="courseName"
                className="bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={data?.title}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Course Description{" "}
              </label>
              <textarea
                type="text"
                name="courseDescription"
                className=" bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={data?.description}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number *</label>
              <input
                type="number"
                name="phone"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">State *</label>
              <select
                name="state"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {stateCityData?.states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Add City dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">City *</label>
              <select
                name="city"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={formData.city || ""}
                onChange={handleChange}
                disabled={!selectedState}
              >
                <option value="">
                  {selectedState ? "Select City" : "First select State"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Stream *</label>
              <input
                type="text"
                name="stream"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Highest Qualification *
              </label>
              <select
                name="highestQualification"
                className="shadow  border rounded w-full py-2 px-3  text-gray-700 focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              >
                <option value="">Select Highest Qualification </option>
                {highestQualifications.map((qualification) => (
                  <option key={qualification} value={qualification}>
                    {qualification}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">DOB *</label>
              <input
                type="date"
                name="dob"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
          </>
        );

      case "Event":
      case "Workshop":
        return (
          <>
           <div className="mb-4">
              <label className="block text-gray-700 mb-2">{feature} Name</label>
              <input
                type="text"
                name={feature === "Event" ? "eventName" : "workshopName"}
                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-900"
                value={data?.title}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                {feature} Description{" "}
              </label>
              <textarea
                type="text"
                name={feature === "Event" ? "eventDescription" : "workshopDescription"}
                className=" bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={data?.description}
                readOnly
              />
            </div>
             <div className="mb-4">
              <label className="block text-gray-700 mb-2">{feature} {feature ==="Event" ? 'Organizer' :'Instructor'}</label>
              <input
                type="text"
                name= {feature ==="Event" ? 'eventOrganizer' :'eventInstructor'}
                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-900"
                value={feature ==="Event" ?data?.organizer : data?.instructor}
                readOnly
              />
            </div>
            { feature ==="Event" && <div className="mb-4">
              <label className="block text-gray-700 mb-2">{feature} Location</label>
              <input
                type="text"
                name="eventLocation"
                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-900"
                value={data?.location}
                readOnly
              />
            </div>}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="number"
                name="phone"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">State *</label>
              <select
                name="state"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {stateCityData?.states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Add City dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">City *</label>
              <select
                name="city"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={formData.city || ""}
                onChange={handleChange}
                disabled={!selectedState}
              >
                <option value="">
                  {selectedState ? "Select City" : "First select State"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Stream *</label>
              <input
                type="text"
                name="stream"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Highest Qualification *
              </label>
              <select
                name="highestQualification"
                className="shadow  border rounded w-full py-2 px-3  text-gray-700 focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              >
                <option value="">Select Highest Qualification </option>
                {highestQualifications.map((qualification) => (
                  <option key={qualification} value={qualification}>
                    {qualification}
                  </option>
                ))}
              </select>
            </div>
           
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">DOB *</label>
              <input
                type="date"
                name="dob"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                How Did You Hear About Us? *
              </label>
              <select
                name="source"
                className="shadow  border rounded w-full py-2 px-3  text-gray-700 focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Social Media">Social Media</option>
                <option value="Friend">Friend</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        );

      case "Internship":
        return (
          <>

           <div className="mb-4">
              <label className="block text-gray-700 mb-2">{feature} Name</label>
              <input
                type="text"
                name="internshipName"
                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-900"
                value={data?.title}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                {feature} Description{" "}
              </label>
              <textarea
                type="text"
                name="internshipDescription"
                className=" bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={data?.description}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">{feature} Location</label>
              <input
                type="text"
                name="internshipLocation"
                className=" bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={data?.location}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number *</label>
              <input
                type="number"
                name="phone"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">State *</label>
              <select
                name="state"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {stateCityData?.states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Add City dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">City *</label>
              <select
                name="city"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={formData.city || ""}
                onChange={handleChange}
                disabled={!selectedState}
              >
                <option value="">
                  {selectedState ? "Select City" : "First select State"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                University/College Name *
              </label>
              <input
                type="text"
                name="university"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Graduation Year *
              </label>
              <select
                name="graduationYear"
                className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              >
                <option value="">Select</option>
                {Array.from(
      { length: 26 }, // 15 past + 10 future + current year
      (_, i) => new Date().getFullYear() - 15 + i
    ).map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                LinkedIn Profile (Optional)
              </label>
              <input
                type="url"
                name="linkedin"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Portfolio/GitHub (Optional)
              </label>
              <input
                type="url"
                name="portfolio"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Resume (PDF only) *
              </label>
              <input
                type="file"
                name="resume"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                accept=".pdf"
                required
                onChange={handleFileChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                name="coverLetter"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">DOB *</label>
              <input
                type="date"
                name="dob"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
          </>
        );

      case "Graduate Career":
      case "Professional Career":
        return (
          <>
          <div className="mb-4">
              <label className="block text-gray-700 mb-2">{feature} Role</label>
              <input
                type="text"
                name={feature === "Graduate Career" ? "graduateCareerName" : "professionalCareerName"}
                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-900"
                value={data?.title}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                {feature} Description{" "}
              </label>
              <textarea
                type="text"
                name={feature === "Graduate Career" ? "graduateCareerDescription" : "professionalCareerDescription"}
                className=" bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={data?.description}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">{feature} Location</label>
              <input
                type="text"
                name={feature === "Graduate Career" ? "graduateCareerLocation" : "professionalCareerLocation"}
                className=" bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={data?.location}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number *</label>
              <input
                type="number"
                name="phone"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">DOB *</label>
              <input
                type="date"
                name="dob"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">State *</label>
              <select
                name="state"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {stateCityData?.states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Add City dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">City *</label>
              <select
                name="city"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                required
                value={formData.city || ""}
                onChange={handleChange}
                disabled={!selectedState}
              >
                <option value="">
                  {selectedState ? "Select City" : "First select State"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {feature === "Graduate Career" && (
              <>
                 <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Highest Qualification *
              </label>
              <select
                name="highestQualification"
                className="shadow  border rounded w-full py-2 px-3  text-gray-700 focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              >
                <option value="">Select Highest Qualification </option>
                {highestQualifications.map((qualification) => (
                  <option key={qualification} value={qualification}>
                    {qualification}
                  </option>
                ))}
              </select>
            </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    University/College Name
                  </label>
                  <input
                    type="text"
                    name="university"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Graduation Year
                  </label>
                  <select
                    name="graduationYear"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {Array.from(
      { length: 26 }, // 15 past + 10 future + current year
      (_, i) => new Date().getFullYear() - 15 + i
    ).map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
                  </select>
                </div>
               
              </>
            )}

            {feature === "Professional Career" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <select
                    name="experience"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
              
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Current Employer (if applicable)
                  </label>
                  <input
                    type="text"
                    name="employer"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Skills (comma separated) *
                  </label>
                  <input
                    type="text"
                    name="skills"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Resume (PDF only) *
              </label>
              <input
                type="file"
                name="resume"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                accept=".pdf"
                required
                onChange={handleFileChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                name="coverLetter"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Portfolio/GitHub (Optional)
              </label>
              <input
                type="url"
                name="portfolio"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                LinkedIn Profile (Optional)
              </label>
              <input
                type="url"
                name="linkedin"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Expected Salary (Rs/Year) *
              </label>
              
                <input
                  type="number"
                  min="0"
                  name="expectedSalary"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleChange}
                />
                
              
            </div>
          
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Available Start Date *
              </label>
              
                <input
                  type="date"
                  name="availableStartDate"
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleChange}
                />
                
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                How Did You Hear About Us? *
              </label>
              <select
                name="source"
                className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Social Media">Social Media</option>
                <option value="Job Portal">Job Portal</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };


   useEffect(() => {
      const processedData = processStateCityData(IndiaStateCity);
      setStateCityData(processedData);
    }, []);
  
    // Update cities when state changes
    useEffect(() => {
      if (selectedState && stateCityData) {
        setCities(stateCityData.stateMap[selectedState] || []);
        setFormData((prev) => ({ ...prev, city: "" })); // Reset city when state changes
      }
    }, [selectedState, stateCityData]);


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl flex flex-col max-h-[90vh]">
        {/* Header - fixed */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Enroll for {feature}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form content - scrollable */}
        <div className="">
          <form onSubmit={handleSubmit}>
            <div className="max-h-[65vh] overflow-y-auto px-6 py-4 ">
              {renderFormFields()}
            </div>
            <div className={`p-4 border-t border-gray-200 flex ${paymentEnabled ? "justify-between" : "justify-end"} `}>
                { paymentEnabled && 
                
                
                 <UserPaymentBtn 
                 amount = {amount}
                 feature = {feature}
                 itemId = {itemId}
                 submissionId={itemId}
                 userId={userId}
                 id={data?.id}
                 userDetails={paymentConfig?.userDetails}
                 onPaymentSuccess={() => onClose()}
                 onPaymentFailure={(error) => console.error(error)}/>
                
                }
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
                {/* <button
                  type="button"
                  onClick={processPayment}
                  disabled={paymentProcessing}
                  className={`px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500 ${
                    paymentProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {paymentProcessing ? 'Processing...' : 'Pay Now'}
                </button> */}
              </div>
            </div>
          </form>
        </div>

        {/* Footer - fixed */}
      </div>
    </div>
  );
};




export default FormDialog;
