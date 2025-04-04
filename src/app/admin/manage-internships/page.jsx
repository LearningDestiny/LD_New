'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaEye ,FaRegLightbulb } from 'react-icons/fa';
import axios from 'axios'
import AdminDialog from "../../../components/ui/admin-dialog"
import DialogMiniImage from "../../../components/ui/dialog-mini-image";
export default function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [editingInternship, setEditingInternship] = useState(null);
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter();

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
        setLoading(true);
        const response = await axios.get("/api/internships");
        const internshipsData = response.data.map((internship) => ({
            ...internship,
            imageUrl: internship.image || internship.imageUrl,
        }));
        setInternships(internshipsData);
    } catch (error) {
        console.error("Error fetching internships:", error);
    } finally {
        setLoading(false);
    }
};

  const handleEditInternship = (internship) => {
    setEditingInternship({ ...internship, imageFile: null, imageUrl: internship.image || internship.imageUrl ,
      highlights: internship?.highlights || [],
      requirements: internship?.requirements || [],
      responsibilities: internship?.responsibilities || []
     });
  };

  const handleUpdateInternship = async () => {
    if (!editingInternship) return;
    if (!editingInternship.imageFile && !editingInternship.imageUrl) {
      alert("Please upload an image");
      return;
    }
    if (editingInternship.highlights.length === 0) {
      alert("Please add at least one highlight.");
      return;
    }
    if (editingInternship.requirements.length === 0) {
      alert("Please add at least one requirement.");
      return;
    }
    if (editingInternship.responsibilities.length === 0) {
      alert("Please add at least one responsibility.");
      return;
    }
   


    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("id", editingInternship.id);
      formData.append("title", editingInternship.title);
      formData.append("company", editingInternship.company);
      formData.append("stipend", editingInternship.stipend);
      formData.append("duration", editingInternship.duration);
      formData.append("description", editingInternship.description);
      formData.append("summaryDescription", editingInternship.summaryDescription);
      formData.append("location", editingInternship.location);
      formData.append("lastUpdated", new Date().toISOString());
      formData.append("highlights", JSON.stringify(editingInternship.highlights));
      formData.append("requirements", JSON.stringify(editingInternship.requirements));
      formData.append("responsibilities", JSON.stringify(editingInternship.responsibilities));


      if (editingInternship.imageFile) {
        formData.append("image", editingInternship.imageFile);
      } else if (editingInternship.imageUrl) {
        formData.append("imageUrl", editingInternship.imageUrl); // Retain existing URL
      }

      if (editingInternship.id) {
        await axios.put("/api/internships", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/internships", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setEditingInternship(null);
      fetchInternships();
      setSuccessMessage(editingInternship.id ? "Internship updated successfully!" : "Internship added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving internship:", error);
      alert("Failed to save internship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship?")) return;
    try {
      setLoading(true);
      await axios.delete(`/api/internships?id=${id}`);
      fetchInternships();
    } catch (error) {
      console.error("Error deleting internship:", error);
      alert("Failed to delete internship.");
    } finally {
      setLoading(false);
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingInternship((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingInternship((prev) => prev ? { ...prev, imageUrl: reader.result, imageFile: file } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddInternship = () => {
    setEditingInternship({
      id: '',
      title: '',
      company: '',
      stipend: '',
      duration: '',
      description: '',
      summaryDescription: '',
      imageUrl: '',
      imageFile: null,
      highlights: [],
      location: '',
      organizer: '',
      lastUpdated: new Date().toISOString(),
      requirements: [],
      responsibilities: [],
    });
  };

  const handleArrayValueChange = (index, value, key) => {
    setEditingInternship((prev) => {
      if (!prev) return null;
      const newArray = [...prev[key]];
      newArray[index] = value;
      return { ...prev, [key]: newArray };
      
    });
  }

  const handleArrayValueDelete = (index, key) => {
    setEditingInternship((prev) => {
      if (!prev) return null;
      const newArray = [...prev[key]];
      newArray.splice(index, 1);
      return { ...prev, [key]: newArray };
    });
  }

  const handleAddArrayValue = (key) => {
    setEditingInternship((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: [...(prev[key] || []), ''] };
    });
    }


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Internships</h1>
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <button
        onClick={handleAddInternship}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 cursor-pointer"
      >
        <FaPlus className="inline mr-2" /> Add New Internship
      </button>

      {loading && <p>Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-lg shadow-md p-6">
            <img
              src={internship.image ? internship.image : internship.imageUrl}
              alt={internship.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{internship.title}</h2>
            <p className="text-gray-600 mb-2">{internship.company}</p>
            <p className="text-gray-800 mb-2">{internship.stipend}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditInternship(internship)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 cursor-pointer"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() => router.push(`/admin/manage-internships/${internship.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 cursor-pointer"
              >
                <FaEye className="inline mr-2" /> View Details
              </button>
              <button
                onClick={() => handleDeleteInternship(internship.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 cursor-pointer"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      
      {
        editingInternship && (
          <AdminDialog
          title= {editingInternship.id ? 'Edit Internship' : 'Add New Internship'}
          onClose = {() => setEditingInternship(null)}
          onSubmit = {()=>handleUpdateInternship()}
          submitBtnLabel = {editingInternship.id ? 'Update Internship' : 'Add Internship'}
               >
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={editingInternship.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={editingInternship.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Stipend *
                </label>
                <input
                  type="text"
                  name="stipend"
                  required
                  value={editingInternship.stipend}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  required
                  value={editingInternship.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={editingInternship.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Summary Description
                </label>
                <textarea
                  name="summaryDescription"
                  value={editingInternship.summaryDescription}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows={2}
                ></textarea>
              </div>
              <div className="mb-4">
                {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                  Image *
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  required
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  accept="image/*"
                /> */}
                <DialogMiniImage
                  state={editingInternship} 
                  setState={setEditingInternship}
                  handleImageChange={handleImageChange}
                  />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={editingInternship.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Requirements *
            </label>
            {editingInternship?.requirements &&
              editingInternship.requirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-center mb-3 border shadow-sm p-3 rounded-md"
                >
                  <div className="mr-3 mt-1 flex-col">
                    <div
                      className="flex items-center justify-center text-blue-500 rounded-full bg-blue-100  "
                      style={{ padding: "0.41rem" }}
                    >
                      <FaRegLightbulb className=" text-xs" />
                    </div>
                    <div
                      className="flex items-center justify-center text-red-500 rounded-full bg-red-100 mt-2 "
                      style={{ padding: "0.41rem" }}
                    >
                      <FaTrash
                        className=" text-xs cursor-pointer"
                        onClick={() => handleArrayValueDelete(index, "requirements")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full">
                    <p className="text-gray-700 text-sm font-bold mb-1">
                      Title{" "}
                    </p>
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) =>
                        handleArrayValueChange(index, e.target.value, "requirements")
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm "
                    />
                  </div>
                </div>
              ))}
            <button
              type="button"
              onClick={()=>handleAddArrayValue("requirements")}
              className="mt-2 bg-blue-500 text-xs text-white px-4 py-2 flex items-center  rounded-full hover:bg-blue-600 transition duration-300"
            >
              <FaPlus className="inline mr-1 " /> Add Requirement
            </button>
               </div>
              <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Responsibilities *
            </label>
            {editingInternship?.responsibilities &&
              editingInternship.responsibilities.map((responsibility, index) => (
                <div
                  key={index}
                  className="flex items-center mb-3 border shadow-sm p-3 rounded-md"
                >
                  <div className="mr-3 mt-1 flex-col">
                    <div
                      className="flex items-center justify-center text-blue-500 rounded-full bg-blue-100  "
                      style={{ padding: "0.41rem" }}
                    >
                      <FaRegLightbulb className=" text-xs" />
                    </div>
                    <div
                      className="flex items-center justify-center text-red-500 rounded-full bg-red-100 mt-2 "
                      style={{ padding: "0.41rem" }}
                    >
                      <FaTrash
                        className=" text-xs cursor-pointer"
                        onClick={() => handleArrayValueDelete(index, "responsibilities")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full">
                    <p className="text-gray-700 text-sm font-bold mb-1">
                    Title{" "}
                    </p>
                    <input
                      type="text"
                      value={responsibility}
                      onChange={(e) =>
                        handleArrayValueChange(index, e.target.value, "responsibilities")
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm "
                    />
                  </div>
                </div>
              ))}
            <button
              type="button"
              onClick={()=>handleAddArrayValue("responsibilities")}
              className="mt-2 bg-blue-500 text-xs text-white px-4 py-2 flex items-center  rounded-full hover:bg-blue-600 transition duration-300"
            >
              <FaPlus className="inline mr-1 " /> Add Responsibility
            </button>
               </div>
              <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Highlights *
            </label>
            {editingInternship?.highlights &&
              editingInternship.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-center mb-3 border shadow-sm p-3 rounded-md"
                >
                  <div className="mr-3 mt-1 flex-col">
                    <div
                      className="flex items-center justify-center text-blue-500 rounded-full bg-blue-100  "
                      style={{ padding: "0.41rem" }}
                    >
                      <FaRegLightbulb className=" text-xs" />
                    </div>
                    <div
                      className="flex items-center justify-center text-red-500 rounded-full bg-red-100 mt-2 "
                      style={{ padding: "0.41rem" }}
                    >
                      <FaTrash
                        className=" text-xs cursor-pointer"
                        onClick={() => handleArrayValueDelete(index, "highlights")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full">
                    <p className="text-gray-700 text-sm font-bold mb-1">
                    Title{" "}
                    </p>
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) =>
                        handleArrayValueChange(index, e.target.value, "highlights")
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm "
                    />
                  </div>
                </div>
              ))}
            <button
              type="button"
              onClick={()=>handleAddArrayValue("highlights")}
              className="mt-2 bg-blue-500 text-xs text-white px-4 py-2 flex items-center  rounded-full hover:bg-blue-600 transition duration-300"
            >
              <FaPlus className="inline mr-1 " /> Add Highlight
            </button>
               </div>




               </AdminDialog>
        )
      }
    </div>
  );
};
