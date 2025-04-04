"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaRegLightbulb,
} from "react-icons/fa";
import axios from "axios";
import AdminDialog from "../../../components/ui/admin-dialog";
import DialogMiniImage from "../../../components/ui/dialog-mini-image";


export default function ManageWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/workshops");
      const workshopsData = response.data.map((workshop) => ({
        ...workshop,
        imageUrl: workshop.image || workshop.imageUrl,
      }));
      setWorkshops(workshopsData);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditWorkshop = (workshop) => {
    setEditingWorkshop({
      ...workshop,
      imageFile: null,
      imageUrl: workshop.image || workshop.imageUrl,
    });
  };

  const handleUpdateWorkshop = async () => {
    if (!editingWorkshop) return;
    if (!editingWorkshop.imageFile && !editingWorkshop.imageUrl) {
      alert("Please upload an image");
      return;
    }
    if(!editingWorkshop?.rating ){
      if(editingWorkshop?.rating >5 || editingWorkshop?.rating <0){
        alert("Rating must be between 0 and 5");
        return;
      }
    }

    if (editingWorkshop.highlights.length === 0) {
      alert("Please add at least one highlight");
      return;
    }
    if (
      editingWorkshop.highlights.some((highlight) => highlight.trim() === "")
    ) {
      alert("Please fill in all highlight fields.");
      return;
    }

    // add validation for roadmap
    if (editingWorkshop.roadmap.length === 0) {
      alert("Please add at least one roadmap month");
      return;
    }

    if (editingWorkshop.roadmap.some((month) => month.month.trim() === "")) {
      alert("Please fill in all roadmap month fields.");
      return;
    }
    try {
      if (editingWorkshop.roadmap.some((month) => month.weeks.length === 0)) {
        alert("Please add at least one roadmap week");
        return;
      }
      if (
        editingWorkshop.roadmap.some((month) =>
          month.weeks.some((week) => week.week.trim() === "")
        )
      ) {
        alert("Please fill in all roadmap week fields.");
        return;
      }
      if (
        editingWorkshop.roadmap.some((month) =>
          month.weeks.some((week) => week.topics.length === 0)
        )
      ) {
        alert("Please add at least one roadmap topic");
        return;
      }
      if (
        editingWorkshop.roadmap.some((month) =>
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
      setLoading(true);
      const formData = new FormData();
      formData.append("id", editingWorkshop.id);
      formData.append("title", editingWorkshop.title);
      formData.append("price", editingWorkshop.price);
      formData.append("description", editingWorkshop.description);
      formData.append("duration", editingWorkshop.duration);
      formData.append("instructor", editingWorkshop.instructor);
      formData.append("highlights", JSON.stringify(editingWorkshop.highlights));
      formData.append("rating", editingWorkshop.rating);
      formData.append("ratingCount", editingWorkshop.ratingCount);
      formData.append("lectureCount", editingWorkshop.lectureCount);
      formData.append("roadmap", JSON.stringify(editingWorkshop.roadmap));

      if (editingWorkshop.imageFile) {
        formData.append("image", editingWorkshop.imageFile);
      } else if (editingWorkshop.imageUrl) {
        formData.append("imageUrl", editingWorkshop.imageUrl); // Retain existing URL
      }

      if (editingWorkshop.id) {
        await axios.put("/api/workshops", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/workshops", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setEditingWorkshop(null);
      fetchWorkshops(); // Refresh the workshops list
      setSuccessMessage(
        editingWorkshop.id
          ? "Workshop updated successfully!"
          : "Workshop added successfully!"
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving workshop:", error);
      alert("Failed to save workshop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkshop = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workshop?"))
      return;
    try {
      setLoading(true);
      await axios.delete(`/api/workshops?id=${id}`);
      fetchWorkshops();
    } catch (error) {
      console.error("Error deleting workshop:", error);
      alert("Failed to delete workshop.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingWorkshop((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingWorkshop((prev) =>
          prev ? { ...prev, imageUrl: reader.result, imageFile: file } : null
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHighlightChange = (index, value) => {
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      const newHighlights = [...prev.highlights];
      newHighlights[index] = value;
      return { ...prev, highlights: newHighlights };
    });
  };

  const handleAddHighlight = () => {
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      return { ...prev, highlights: [...prev.highlights, ""] };
    });
  };

  const handleAddWorkshop = () => {
    setEditingWorkshop({
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
      rating: 0,
      ratingCount: 0,
      lectureCount: 0,
      roadmap: [],
    });
  };

  const handleDeleteHighlight = (index) => {
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      const newHighlights = [...prev.highlights];
      newHighlights.splice(index, 1);
      return { ...prev, highlights: newHighlights };
    });
  };

  const addMonth = () => {
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: [...prev.roadmap, { month: "", weeks: [] }] };
    });
  };

  //  the addWeek has an issue when its call its create two weeks instead of one
  const addWeek = (monthIndex) => {
    let updateCorrectMonth = editingWorkshop.roadmap.map((month, index) => {
      if (index === monthIndex) {
        return { ...month, weeks: [...month.weeks, { week: "", topics: [] }] };
      }
      return month;
    });
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const addTopic = (monthIndex, weekIndex) => {
    let updateCorrectMonth = editingWorkshop.roadmap.map((month, index) => {
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
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleMonthChange = (monthIndex, key, value) => {
    let updateCorrectMonth = editingWorkshop.roadmap.map((month, index) => {
      if (index === monthIndex) {
        return { ...month, [key]: value };
      }
      return month;
    });
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleDeleteMonth = (monthIndex) => {
    let updateCorrectMonth = editingWorkshop.roadmap.filter(
      (month, index) => index !== monthIndex
    );
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleDeleteWeek = (monthIndex, weekIndex) => {
    let updateCorrectMonth = editingWorkshop.roadmap.map((month, index) => {
      if (index === monthIndex) {
        let updateCorrectWeek = month.weeks.filter(
          (week, index) => index !== weekIndex
        );
        return { ...month, weeks: updateCorrectWeek };
      }
      return month;
    });
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleWeekChange = (monthIndex, weekIndex, key, value) => {
    let updateCorrectMonth = editingWorkshop.roadmap.map((month, index) => {
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
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleDeleteWeekTopic = (monthIndex, weekIndex, topicIndex) => {
    let updateCorrectMonth = editingWorkshop.roadmap.map((month, index) => {
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
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  const handleTopicChange = (monthIndex, weekIndex, topicIndex, value) => {
    let updateCorrectMonth = editingWorkshop.roadmap.map((month, index) => {
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
    setEditingWorkshop((prev) => {
      if (!prev) return null;
      return { ...prev, roadmap: updateCorrectMonth };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Workshops</h1>
      {successMessage && (
        <div
          className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <button
        onClick={handleAddWorkshop}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
      >
        <FaPlus className="inline mr-2" /> Add New Workshop
      </button>

      {loading && <p>Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop) => (
          <div key={workshop.id} className="bg-white rounded-lg shadow-md p-6">
            <img
              src={workshop.image ? workshop.image : workshop.imageUrl}
              alt={workshop.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{workshop.title}</h2>
            <p className="text-gray-600 mb-2">{workshop.instructor}</p>
            <p className="text-gray-800 mb-2">{workshop.price}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditWorkshop(workshop)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() =>
                  router.push(`/admin/manage-workshops/${workshop.id}`)
                }
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                <FaEye className="inline mr-2" /> View Details
              </button>
              <button
                onClick={() => handleDeleteWorkshop(workshop.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingWorkshop && (
        <AdminDialog
          title={editingWorkshop.id ? "Edit Workshop" : "Add New Workshop"}
          onClose={() => setEditingWorkshop(null)}
          onSubmit={() => handleUpdateWorkshop()}
          submitBtnLabel={
            editingWorkshop.id ? "Update Workshop" : "Add Workshop"
          }
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={editingWorkshop.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="instructor"
            >
              Instructor *
            </label>
            <input
              type="text"
              id="instructor"
              required
              name="instructor"
              value={editingWorkshop.instructor}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price *
            </label>
            <input
              type="text"
              id="price"
              name="price"
              required
              value={editingWorkshop.price}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lectureCount"
            >
              Lecture Count *
            </label>
            <input
              type="number"
              id="lectureCount"
              name="lectureCount"
              required
              value={editingWorkshop.lectureCount}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="duration"
            >
              Duration *
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              required
              value={editingWorkshop.duration}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={editingWorkshop.description}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={3}
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lectureCount"
            >
              Rating *
            </label>
            <input
              type="number"
              min="0"
              max="5"
              id="rating"
              name="rating"
              required
              value={editingWorkshop.rating}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lectureCount"
            >
              Rating Count *
            </label>
            <input
              type="number"
              id="ratingCount"
              name="ratingCount"
              required
              value={editingWorkshop.ratingCount}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <DialogMiniImage
              state={editingWorkshop}
              setState={setEditingWorkshop}
              handleImageChange={handleImageChange}
            />
          </div>
          <div className="mb-4"></div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Highlights *
            </label>
            {editingWorkshop?.highlights &&
              editingWorkshop.highlights.map((highlight, index) => (
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
                        onClick={() => handleDeleteHighlight(index)}
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
                        handleHighlightChange(index, e.target.value)
                      }
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
            {editingWorkshop?.roadmap.map((month, monthIndex) => (
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
      )}
    </div>
  );
}
