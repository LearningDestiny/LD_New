"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";

const JobApplication = () => {
  const searchParams = useSearchParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [resumeName, setResumeName] = useState("No file chosen");
  const [loading,setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    email: "",
    phoneNumber: "",
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const jobData = {
    1: {
      title: "Software Engineer",
      description:
        "As a Software Engineer, you will be responsible for designing, developing, and maintaining high-quality web applications. You will work with a team of developers, designers, and product managers to build scalable and efficient software solutions.",
      requirements: [
        "1+ years of experience in React.js, Node.js, MongoDB, MySQL, JavaScript, and ASP.NET (MVC).",
        "Strong understanding of front-end and back-end development.",
        "Experience with RESTful APIs and database management.",
        "Ability to write clean, efficient, and well-documented code.",
        "Excellent problem-solving skills and a keen eye for detail.",
        "Good communication and teamwork skills.",
      ],
    },
    2: {
      title: "Web Designer",
      description:
        "As a Web Designer, you will be responsible for creating visually appealing and user-friendly web designs. You will work closely with developers and marketing teams to enhance website aesthetics and usability.",
      requirements: [
        "Proficiency in HTML, CSS, and JavaScript.",
        "Experience with UI/UX design tools like Figma or Adobe XD.",
        "Understanding of responsive web design principles.",
        "Ability to create engaging layouts and designs.",
        "Good communication skills and attention to detail.",
        "Experience with modern design trends and web accessibility.",
      ],
    },
    3: {
      title: "Product Manager",
      description:
        "As a Product Manager, you will be responsible for defining the product vision, strategy, and roadmap. You will work closely with cross-functional teams, including engineering, design, and marketing, to ensure successful product development and launch.",
      requirements: [
        "2+ years of experience in product management or a related role.",
        "Strong analytical skills and the ability to interpret data-driven insights.",
        "Experience in Agile methodologies and software development lifecycle.",
        "Excellent communication and stakeholder management skills.",
        "Ability to define clear product goals and prioritize features accordingly.",
        "Understanding of user experience (UX) principles and market trends.",
      ],
    },
    4: {
      title: "Data Scientist",
      description:
        "As a Data Scientist, you will analyze complex datasets to extract meaningful insights and build predictive models. You will work with machine learning algorithms and data visualization tools to drive data-driven decision-making.",
      requirements: [
        "Proficiency in Python, R, or SQL for data analysis.",
        "Experience with machine learning frameworks such as TensorFlow or Scikit-learn.",
        "Strong statistical analysis and data visualization skills.",
        "Knowledge of data cleaning, preprocessing, and feature engineering.",
        "Familiarity with big data technologies like Hadoop or Spark is a plus.",
        "Ability to communicate complex data findings in a clear and concise manner.",
      ],
    },
    5: {
      title: "Tech Lead",
      description:
        "As a Tech Lead, you will provide technical leadership and guidance to a team of engineers. You will be responsible for architectural decisions, code quality, and ensuring best practices in software development.",
      requirements: [
        "5+ years of experience in software development with leadership responsibilities.",
        "Expertise in full-stack development with modern technologies.",
        "Ability to mentor and guide junior developers.",
        "Strong problem-solving skills and architectural decision-making.",
        "Experience with DevOps, CI/CD, and cloud platforms like AWS or Azure.",
        "Excellent communication and collaboration skills.",
      ],
    },
  };

  useEffect(() => {

    // request the data through api 
    const fetchData = async (id) => {
      try {
        const response = await fetch(`/api/careers/${id}`);
        if (!response.ok) throw new Error('Failed to fetch internship');
        const data = await response.json();
        console.log(data,">>>>>")
        setJobDetails(data[0]);
        setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
          }
     };

   



    const id = Number(searchParams.get("id"));
    console.log(id,">>>>")
    fetchData(id);
    // if (id && jobData[id]) {
    //   setJobDetails({ id, ...jobData[id] });
    // } else {
    //   setJobDetails({
    //     id,
    //     description: searchParams.get("description") || "No description available",
    //     requirements: searchParams.get("requirements") || "No requirements listed",
    //   });
    // }
  }, [searchParams]);



  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "phoneNumber" && !/^\d*$/.test(value)) {
      return; // Prevent non-numeric input
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));

    if (files) {
      setResumeName(files[0] ? files[0].name : "No file chosen");
    }
  };

  const validateForm = () => {
    const { firstName, lastName, email, phoneNumber, resume } = formData;
    if (!firstName || !lastName || !email || !phoneNumber || !resume) {
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
      const googleSheetsResponse = await fetch('/api/googleSheetb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        }),
      });

      if (!googleSheetsResponse.ok) {
        const errorData = await googleSheetsResponse.json();
        throw new Error(errorData.error || 'Failed to submit data to Google Sheets');
      }

      // Step 2: Upload to Google Drive
      const driveResponse = await fetch('/api/uploadTodrivee', {
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
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        email: "",
        phoneNumber: "",
        resume: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input field
      }
      setResumeName("No file chosen"); 
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

  if (!jobDetails) {
    return <p className="text-center text-gray-500">Loading job details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-200 shadow-md rounded-lg mt-6">
      <h1 className="text-3xl font-bold mb-4">{jobDetails.title}</h1>
      <div className="mb-6">
        <p><strong> Job Description:</strong> {jobDetails.description}</p>
        <p><strong> Job Requirements:</strong></p>
        <ul className="list-disc list-inside">
          {Array.isArray(jobDetails.requirements) ? (
            jobDetails.requirements.map((req, index) => <li key={index}>{req}</li>)
          ) : (
            <li>{jobDetails.requirements}</li>
          )}
        </ul>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <Input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <Input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <Input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <Input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
        <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <Input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
        <Input ref={fileInputRef} type="file" name="resume" id="resume" onChange={handleChange} required accept=".pdf,.doc,.docx" className="hidden" />
        <div className="flex flex-col">
          <label
            htmlFor="resume"
            className="block w-fit px-4 py-2 bg-gray-400 text-black text-sm font-semibold cursor-pointer hover:bg-gray-500 transition duration-300"
          >
            Upload Resume
          </label>
          <span className="text-sm text-gray-600 mt-1">{resumeName}</span>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-gray-800 text-white py-2 rounded">
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default JobApplication;