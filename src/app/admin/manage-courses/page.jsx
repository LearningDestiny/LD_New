"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaEye, FaRegLightbulb } from "react-icons/fa"
import axios from "axios"
import AdminDialog from "../../../components/ui/admin-dialog"
import DialogMiniImage from "../../../components/ui/dialog-mini-image"
export default function ManageCourses() {
  const [courses, setCourses] = useState([])
  const [editingCourse, setEditingCourse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/courses")
      const coursesData = response.data.map((course) => ({
        ...course,
        imageUrl: course.image || course.imageUrl,
      }))
      setCourses(coursesData)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditCourse = (course) => {
    setEditingCourse({ ...course, imageFile: null,imageUrl:course?.image || course?.imageUrl, highlights: course.highlights || [] , roadmap : course?.roadmap || [] })
  }

  const handleUpdateCourse = async () => {
    if (!editingCourse) return
    if (!editingCourse.imageFile && !editingCourse.imageUrl) {
      alert("Please upload an image");
      return;
    }
    if (editingCourse.highlights.length === 0) {
      alert("Please add at least one highlight.");
      return;
    }
    if (editingCourse.highlights.some((highlight) => highlight.trim() === "")) {
      alert("Please fill in all highlight fields.");
      return;
    }

        // add validation for roadmap
        if (editingCourse.roadmap.length === 0) {
          alert("Please add at least one roadmap month");
          return;
        }
    
        if (editingCourse.roadmap.some((month) => month.month.trim() === "")) {
          alert("Please fill in all roadmap month fields.");
          return;
        }
        try {
          if (editingCourse.roadmap.some((month) => month.weeks.length === 0)) {
            alert("Please add at least one roadmap week");
            return;
          }
          if (
            editingCourse.roadmap.some((month) =>
              month.weeks.some((week) => week.week.trim() === "")
            )
          ) {
            alert("Please fill in all roadmap week fields.");
            return;
          }
          if (
            editingCourse.roadmap.some((month) =>
              month.weeks.some((week) => week.topics.length === 0)
            )
          ) {
            alert("Please add at least one roadmap topic");
            return;
          }
          if (
            editingCourse.roadmap.some((month) =>
              month.weeks.some((week) =>
                week.topics.some((topic) => topic.trim() === "")
              )
            )
          ) {
            alert("Please fill in all roadmap topic fields.");
            return;
          }
        } catch (error) {
          console.error("Error validating roadmap:", error);
          alert("Failed to validate roadmap. Please try again.");
        }


    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("id", editingCourse.id)
      formData.append("title", editingCourse.title)
      formData.append("price", editingCourse.price)
      formData.append("description", editingCourse.description)
      formData.append("duration", editingCourse.duration)
      formData.append("instructor", editingCourse.instructor)
      formData.append("highlights", JSON.stringify(editingCourse.highlights))
      formData.append("roadmap", JSON.stringify(editingCourse.roadmap))
      formData.append('lectureCount', editingCourse?.lectureCount)

      if (editingCourse.imageFile) {
        // const newImagePath = `/images/${editingCourse.imageFile.name}`;
        // formData.append("imagePath", newImagePath);
        formData.append("image", editingCourse.imageFile)
      } else if (editingCourse.imageUrl) {
        formData.append("imageUrl", editingCourse.imageUrl) // Retain existing URL
      }

      if (editingCourse.id) {
        await axios.put("/api/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        await axios.post("/api/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      setEditingCourse(null)
      fetchCourses()
      setSuccessMessage(editingCourse.id ? "Course updated successfully!" : "Course added successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error saving course:", error)
      alert("Failed to save course. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return
    try {
      setLoading(true)
      await axios.delete(`/api/courses?id=${id}`)
      fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
      alert("Failed to delete course.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditingCourse((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditingCourse((prev) => (prev ? { ...prev, imageUrl: reader.result, imageFile: file } : null))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddHighlight = () => {
    setEditingCourse((prev) => {
      if (!prev) return null
      return { ...prev, highlights: [...prev.highlights, ""] }
    })
  }

  const handleAddCourse = () => {
    setEditingCourse({
      id: 0,
      title: "",
      instructor: "",
      price: "",
      imageUrl: "",
      imageFile: null,
      description: "",
      lastUpdated: new Date().toISOString(),
      duration: "",
      highlights: [], 
      roadmap: [],
      lectureCount:''
    })
  }

  const handleDeleteHighlight = (index) => {
    setEditingCourse((prev) => {
      if (!prev) return null
      const newHighlights = [...prev.highlights]
      newHighlights.splice(index, 1)
      return { ...prev, highlights: newHighlights }
    })
  }

  const handleHighlightChange = (index, value) => {
    setEditingCourse((prev) => {
      if (!prev) return null
      const newHighlights = [...prev.highlights]
      newHighlights[index] = value
      return { ...prev, highlights: newHighlights }
    }
  )}


  const addMonth = () => {
    setEditingCourse((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: [...prev.roadmap, { month: "", weeks: [] }] };
    });
  };

  //  the addWeek has an issue when its call its create two weeks instead of one
  const addWeek = (monthIndex) => {
    let updateCorrectMonth = editingCourse.roadmap.map((month, index) => {
      if (index === monthIndex) {
        return { ...month, weeks: [...month.weeks, { week: "", topics: [] }] };
      }
      return month;
    });
    setEditingCourse((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const addTopic = (monthIndex, weekIndex) => {
    let updateCorrectMonth = editingCourse.roadmap.map((month, index) => {
      if (index === monthIndex) {
        let updateCorrectWeek = month.weeks.map((week, index) => {
          if (index === weekIndex) {
            return { ...week, topics: [...week.topics, ""] };
          }
          return week;
        });
        return { ...month, weeks: updateCorrectWeek };
      }
      return month;
    });
    setEditingCourse((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleMonthChange = (monthIndex, key, value) => {
    let updateCorrectMonth = editingCourse.roadmap.map((month, index) => {
      if (index === monthIndex) {
        return { ...month, [key]: value };
      }
      return month;
    });
    setEditingCourse((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleDeleteMonth = (monthIndex) => {
    let updateCorrectMonth = editingCourse.roadmap.filter(
      (month, index) => index !== monthIndex
    );
    setEditingCourse((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleDeleteWeek = (monthIndex, weekIndex) => {
    let updateCorrectMonth = editingCourse.roadmap.map((month, index) => {
      if (index === monthIndex) {
        let updateCorrectWeek = month.weeks.filter(
          (week, index) => index !== weekIndex
        );
        return { ...month, weeks: updateCorrectWeek };
      }
      return month;
    });
    setEditingCourse((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleWeekChange = (monthIndex, weekIndex, key, value) => {
    let updateCorrectMonth = editingCourse.roadmap.map((month, index) => {
      if (index === monthIndex) {
        let updateCorrectWeek = month.weeks.map((week, index) => {
          if (index === weekIndex) {
            return { ...week, [key]: value };
          }
          return week;
        });
        return { ...month, weeks: updateCorrectWeek };
      }
      return month;
    });
    setEditingCourse((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleDeleteWeekTopic = (monthIndex, weekIndex, topicIndex) => {
    let updateCorrectMonth = editingCourse.roadmap.map((month, index) => {
      if (index === monthIndex) {
        let updateCorrectWeek = month.weeks.map((week, index) => {
          if (index === weekIndex) {
            let updateCorrectTopic = week.topics.filter(
              (topic, index) => index !== topicIndex
            );
            return { ...week, topics: updateCorrectTopic };
          }
          return week;
        });
        return { ...month, weeks: updateCorrectWeek };
      }
      return month;
    });
    setEditingCourse((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleTopicChange = (monthIndex, weekIndex, topicIndex, value) => {
    let updateCorrectMonth = editingCourse.roadmap.map((month, index) => {
      if (index === monthIndex) {
        let updateCorrectWeek = month.weeks.map((week, index) => {
          if (index === weekIndex) {
            let updateCorrectTopic = week.topics.map((topic, index) => {
              if (index === topicIndex) {
                return value;
              }
              return topic;
            });
            return { ...week, topics: updateCorrectTopic };
          }
          return week;
        });
        return { ...month, weeks: updateCorrectWeek };
      }
      return month;
    });
    setEditingCourse((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Courses</h1>
      {successMessage && (
        <div
          className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <button
        onClick={handleAddCourse}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
      >
        <FaPlus className="inline mr-2" /> Add New Course
      </button>

      {loading && <p>Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
            <img
              src={course.image ? course.image : course.imageUrl}
              alt={course.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-2">{course.instructor}</p>
            <p className="text-gray-800 mb-2">{course.price}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditCourse(course)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() => router.push(`/admin/manage-courses/${course.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                <FaEye className="inline mr-2" /> View Details
              </button>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {
        editingCourse && (
          <AdminDialog
            title={editingCourse.id ? "Edit Course" : "Add New Course"}
            onClose={() => setEditingCourse(null)}
            onSubmit={()=>handleUpdateCourse()}
            submitBtnLabel={editingCourse.id ? "Update Course" : "Add Course"}
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
                  value={editingCourse.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instructor">
                  Instructor *
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  required
                  value={editingCourse.instructor}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price *
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  required
                  value={editingCourse.price}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                  Duration *
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  required
                  value={editingCourse.duration}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                  Lecture Count *
                </label>
                <input
                  type="text"
                  id="lectureCount"
                  name="lectureCount"
                  required
                  value={editingCourse?.lectureCount || ""}
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
                  value={editingCourse.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
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
                <DialogMiniImage state={editingCourse} setState={setEditingCourse} handleImageChange={handleImageChange} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Highlights *</label>
                {editingCourse?.highlights && editingCourse.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center mb-3 border shadow-sm p-3 rounded-md">
                   <div className="mr-3 mt-1 flex-col">
                     <div className="flex items-center justify-center text-blue-500 rounded-full bg-blue-100  " style={{ padding: "0.41rem" }}>
                     <FaRegLightbulb className=" text-xs" />
                      </div>
                    <div className="flex items-center justify-center text-red-500 rounded-full bg-red-100 mt-2 " style={{ padding: "0.41rem" }}>
                      <FaTrash className=" text-xs cursor-pointer"  onClick={()=>handleDeleteHighlight(index)}/>
                      </div>
                    </div>

                   <div className="flex flex-col w-full">
                   <p className="text-gray-700 text-sm font-bold mb-1">Title </p>
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleHighlightChange(index, e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm "
                    />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="mt-2 bg-blue-500 text-xs text-white px-4 py-2 flex items-center  rounded-full hover:bg-blue-600 transition duration-300"
                >
                  <FaPlus className="inline mr-1 " /> Add Highlight
                </button>
              </div>

               <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Roadmap *
                          </label>
                          {editingCourse?.roadmap.map((month, monthIndex) => (
                            <div
                              key={monthIndex}
                              className="flex flex-col mb-3 border shadow-sm p-3 rounded-md"
                            >
                              <div className="flex items-start mb-3">
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
                                      onClick={() => handleDeleteMonth(monthIndex)}
                                    />
                                  </div>
                                </div>
              
                                <div className="flex flex-col w-full">
                                  <label className="text-gray-700 text-sm font-bold mb-1">
                                    Month:
                                  </label>
                                  <input
                                    type="text"
                                    value={month.month}
                                    onChange={(e) =>
                                      handleMonthChange(monthIndex, "month", e.target.value)
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm mb-2"
                                    placeholder="Enter Month"
                                  />
              
                                  {month.weeks.map((week, weekIndex) => (
                                    <div
                                      key={weekIndex}
                                      className="mb-3 border shadow-sm p-3 rounded-md"
                                    >
                                      <div className="flex items-start w-full ">
                                        <div
                                          className="flex  items-center justify-center text-red-500 rounded-full bg-red-100 mt-1 mr-3 "
                                          style={{ padding: "0.41rem" }}
                                        >
                                          <FaTrash
                                            className=" text-xs cursor-pointer"
                                            onClick={() =>
                                              handleDeleteWeek(monthIndex, weekIndex)
                                            }
                                          />
                                        </div>
                                        <div className="w-full flex-col">
                                          <label className="text-gray-700 text-sm font-bold mb-1">
                                            Week {weekIndex + 1}:
                                          </label>
                                          <input
                                            type="text"
                                            value={week.week}
                                            onChange={(e) =>
                                              handleWeekChange(
                                                monthIndex,
                                                weekIndex,
                                                "week",
                                                e.target.value
                                              )
                                            }
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm mb-2"
                                            placeholder="Enter Week"
                                          />
                                          {week.topics.map((topic, topicIndex) => (
                                            <div className="flex items-start w-full">
                                              <div
                                                className="flex  items-center justify-center text-red-500 rounded-full bg-red-100 mt-1 mr-3 "
                                                style={{ padding: "0.41rem" }}
                                              >
                                                <FaTrash
                                                  className=" text-xs cursor-pointer"
                                                  onClick={() =>
                                                    handleDeleteWeekTopic(
                                                      monthIndex,
                                                      weekIndex,
                                                      topicIndex
                                                    )
                                                  }
                                                />
                                              </div>
              
                                              <div
                                                key={topicIndex}
                                                className="flex-col w-full mb-3"
                                              >
                                                <label className="text-gray-700 text-sm font-bold mb-1">
                                                  Topic {topicIndex + 1}:
                                                </label>
                                                <input
                                                  type="text"
                                                  value={topic}
                                                  onChange={(e) =>
                                                    handleTopicChange(
                                                      monthIndex,
                                                      weekIndex,
                                                      topicIndex,
                                                      e.target.value
                                                    )
                                                  }
                                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm mb-2"
                                                  placeholder="Enter Topic"
                                                />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
              
                                      <button
                                        type="button"
                                        onClick={() => addTopic(monthIndex, weekIndex)}
                                        className="mt-2 bg-blue-500 text-xs text-white px-4 py-2 flex items-center  rounded-full hover:bg-blue-600 transition duration-300"
                                      >
                                        <FaPlus className="inline mr-1" />
                                        Add Topic
                                      </button>
                                    </div>
                                  ))}
              
                                  <button
                                    type="button"
                                    onClick={() => addWeek(monthIndex)}
                                    className="mt-2 bg-blue-500 text-xs text-white px-4 py-2 items-center rounded-full hover:bg-blue-600 transition duration-300 self-start"
                                  >
                                    <FaPlus className="inline mr-1" /> Add Week
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
              
                          <button
                            type="button"
                            onClick={addMonth}
                            className="mt-2 bg-blue-500 text-xs text-white px-4 py-2 flex items-center  rounded-full hover:bg-blue-600 transition duration-300"
                          >
                            <FaPlus className="inline mr-1" /> Add Month
                          </button>
                        </div>

          </AdminDialog>
        )
      }
    </div>
  )
}

