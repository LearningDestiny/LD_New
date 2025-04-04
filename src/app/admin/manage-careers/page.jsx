'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye, FaPlus ,FaRegLightbulb } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import AdminDialog from '../../../components/ui/admin-dialog';

const ManageCareers = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [graduateRoles, setGraduateRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const [jobPostingsResponse, graduateRolesResponse] = await Promise.all([
        axios.get('/api/careers'),
        axios.get('/api/graduate-roles')
      ]);
      setJobPostings(jobPostingsResponse.data || []);
      setGraduateRoles(graduateRolesResponse.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleEditRole = (role, type) => {
    setEditingRole({ ...role, type, requirements: role.requirements || [] }); // Fix: Ensure `requirements` is an array
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
  
    if(editingRole.requirements.length === 0){
      alert("Please add at least one requirement.");
      return;
    }
    // check requirements filed are filled
    for (let i = 0; i < editingRole.requirements.length; i++) {
      if (editingRole.requirements[i] === '') {
        alert("Please fill all requirement fields.");
        return;
      }
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("id", editingRole.id);
      formData.append("title", editingRole.title);
      formData.append("location", editingRole.location);
      formData.append("experience", editingRole.experience);
      formData.append("date", editingRole.date);
      formData.append("description", editingRole.description);
      formData.append("requirements", JSON.stringify(editingRole.requirements)); // Convert requirements to JSON string
  
      const endpoint = editingRole.type === "graduate" ? "/api/graduate-roles" : "/api/careers";
  
      if (editingRole.id) {
        await axios.put(endpoint, formData);
      } else {
        await axios.post(endpoint, formData);
      }
  
      setEditingRole(null);
      fetchRoles();
      setSuccessMessage(editingRole.id ? "Role updated successfully!" : "Role added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Failed to save role. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteRole = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      setLoading(true);
      const endpoint = type === "graduate" ? "/api/graduate-roles" : "/api/careers";
      await axios.delete(`${endpoint}?id=${id}`);
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Failed to delete role.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setEditingRole((prev) => (prev ? { ...prev, [name]: files ? files[0] : value } : null));
  };

  const handleAddRole = (type) => {
    setEditingRole({
      id: 0,
      title: '',
      location: '',
      experience: type === 'graduate' ? 'Fresher' : '',
      date: '',
      description: '',
      requirements: [],
      type
    });
  };

  const handleRequirementsChange = (index, value) => {
    const newRequirements = [...(editingRole?.requirements || [])]; // Fix: Ensure `requirements` is an array
    newRequirements[index] = value;
    setEditingRole((prev) => (prev ? { ...prev, requirements: newRequirements } : null));
  };

  const handleAddRequirement = () => {
    setEditingRole((prev) => {
      if (!prev) return null;
      return { ...prev, requirements: [...(prev.requirements || []), ''] };
    });
  };

  const handleRemoveRequirement = (index) => {
    const newRequirements = editingRole.requirements.filter((_, i) => i !== index);
    setEditingRole((prev) => (prev ? { ...prev, requirements: newRequirements } : null));
  };

  const renderRoleCards = (roles, type) => (
    <>
      <h2 className="text-2xl font-bold mb-4">{type === 'graduate' ? 'Graduate Roles' : 'Job Postings'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {roles?.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{role.title}</h2>
            <p className="text-gray-600 mb-2">{role.location}</p>
            <p className="text-gray-800 mb-2">{role.experience}</p>
            <p className="text-gray-800 mb-2">{role.date}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditRole(role, type)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() => type === 'graduate' ? router.push(`/graduate-roles`) : router.push(`/Careers/${role.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                <FaEye className="inline mr-2" /> View Details
              </button>
              <button
                onClick={() => handleDeleteRole(role.id, type)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const handleDeleteRequirement=(index)=>{
    const newRequirements = editingRole.requirements.filter((_, i) => i !== index);
    setEditingRole((prev) => (prev ? { ...prev, requirements: newRequirements } : null));
    }
  
    const handleRequirementChange=(index, value)=>{
        const newRequirements = [...editingRole.requirements];
        newRequirements[index] = value;
        setEditingRole((prev) => (prev ? { ...prev, requirements: newRequirements } : null));
    }
    const handleAddRequirements = () => {
        setEditingRole((prev) => {
            if (prev) {
                return { ...prev, requirements: [...prev.requirements, ''] };
            }
            return null;
        }
        );
    }


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Careers</h1>
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <div className="flex mb-6 space-x-4">
        <button
          onClick={() => handleAddRole('job')}
          className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          <FaPlus className="inline mr-2" /> Add New Job Posting
        </button>
        <button
          onClick={() => handleAddRole('graduate')}
          className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          <FaPlus className="inline mr-2" /> Add New Graduate Role
        </button>
      </div>

      {renderRoleCards(jobPostings, 'job')}
      {renderRoleCards(graduateRoles, 'graduate')}

      {
        editingRole && (
            <AdminDialog
             title={editingRole.id ? 'Edit Role' : 'Add New Role'}
                onClose={() => setEditingRole(null)}
                onSubmit={()=>handleUpdateRole()}
                submitBtnLabel={editingRole.id ? 'Update Role' : 'Add Role'}
            >
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={editingRole.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={editingRole.location}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
                  Experience *
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  required
                  value={editingRole.experience}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  Date *
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  required
                  value={editingRole.date}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={editingRole.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">Requirements</label>
                              {editingRole?.requirements && editingRole.requirements.map((requirement, index) => (
                                <div key={index} className="flex items-center mb-3 border shadow-sm p-3 rounded-md">
                                 <div className="mr-3 mt-1 flex-col">
                                   <div className="flex items-center justify-center text-blue-500 rounded-full bg-blue-100  " style={{ padding: "0.41rem" }}>
                                   <svg className=" text-xs"  fill="#3b82f6" viewBox="0 0 52 52" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M38.3,27.2A11.4,11.4,0,1,0,49.7,38.6,11.46,11.46,0,0,0,38.3,27.2Zm2,12.4a2.39,2.39,0,0,1-.9-.2l-4.3,4.3a1.39,1.39,0,0,1-.9.4,1,1,0,0,1-.9-.4,1.39,1.39,0,0,1,0-1.9l4.3-4.3a2.92,2.92,0,0,1-.2-.9,3.47,3.47,0,0,1,3.4-3.8,2.39,2.39,0,0,1,.9.2c.2,0,.2.2.1.3l-2,1.9a.28.28,0,0,0,0,.5L41.1,37a.38.38,0,0,0,.6,0l1.9-1.9c.1-.1.4-.1.4.1a3.71,3.71,0,0,1,.2.9A3.57,3.57,0,0,1,40.3,39.6Z"></path> <circle cx="21.7" cy="14.9" r="12.9"></circle> <path d="M25.2,49.8c2.2,0,1-1.5,1-1.5h0a15.44,15.44,0,0,1-3.4-9.7,15,15,0,0,1,1.4-6.4.77.77,0,0,1,.2-.3c.7-1.4-.7-1.5-.7-1.5h0a12.1,12.1,0,0,0-1.9-.1A19.69,19.69,0,0,0,2.4,47.1c0,1,.3,2.8,3.4,2.8H24.9C25.1,49.8,25.1,49.8,25.2,49.8Z"></path> </g></svg>
                                    </div>
                                  <div className="flex items-center justify-center text-red-500 rounded-full bg-red-100 mt-2 " style={{ padding: "0.41rem" }}>
                                    <FaTrash className=" text-xs cursor-pointer"  onClick={()=>handleDeleteRequirement(index)}/>
                                    </div>
                                  </div>
              
                                 <div className="flex flex-col w-full">
                                 <p className="text-gray-700 text-sm font-bold mb-1">Title </p>
                                  <input
                                    type="text"
                                    value={requirement}
                                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm "
                                  />
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={handleAddRequirements}
                                className="mt-2 bg-blue-500 text-xs text-white px-4 py-2 flex items-center  rounded-full hover:bg-blue-600 transition duration-300"
                              >
                                <FaPlus className="inline mr-1 " /> Add Requirements
                              </button>
                            </div>

            </AdminDialog>
        )
      }
    </div>
  );
};

export default ManageCareers;