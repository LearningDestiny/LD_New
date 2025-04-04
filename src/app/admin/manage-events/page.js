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

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/events");
      const eventsData = response.data.map((event) => ({
        ...event,
        imageUrl: event.image || event.imageUrl,
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent({
      ...event,
      imageFile: null,
      imageUrl: event?.image || event?.imageUrl,
      agenda: event?.agenda || [],
      highlights: event?.highlights || [],
    });
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    if (!editingEvent.imageFile && !editingEvent.imageUrl) {
      alert("Please upload an image");
      return;
    }
    if (editingEvent.highlights.length === 0) {
      alert("Please add at least one highlight.");
      return;
    }
    if (editingEvent.agenda.length === 0) {
      alert("Please add at least one agenda item.");
      return;
    }
    if (
      editingEvent.agenda.some(
        (agenda) =>
          agenda.time.trim() === "" ||
          agenda.session.trim() === "" ||
          agenda.speaker.trim() === ""
      )
    ) {
      alert("Please fill in all agenda fields.");
      return;
    }
    if (editingEvent.highlights.some((highlight) => highlight.trim() === "")) {
      alert("Please fill in all highlight fields.");
      return;
    }
   

    try {
      setLoading(true);
      const takeOutEmptyHighlights = editingEvent.highlights.filter(
        (highlight) => highlight.trim() !== ""
      );
      const takeOutEmptyAgenda = editingEvent.agenda.filter(
        (agenda) =>
          agenda.time.trim() !== "" &&
          agenda.session.trim() !== "" &&
          agenda.speaker.trim() !== ""
      );

      const formData = new FormData();
      formData.append("id", editingEvent.id);
      formData.append("title", editingEvent.title);
      formData.append("date", editingEvent.date);
      formData.append("price", editingEvent.price);
      formData.append("duration", editingEvent.duration);
      formData.append("description", editingEvent.description);
      formData.append("summaryDescription", editingEvent.summaryDescription);
      formData.append("highlights", JSON.stringify(takeOutEmptyHighlights));
      formData.append("location", editingEvent.location);
      formData.append("organizer", editingEvent.organizer);
      formData.append("agenda", JSON.stringify(takeOutEmptyAgenda));

      if (editingEvent.imageFile) {
        formData.append("image", editingEvent.imageFile);
      } else if (editingEvent.imageUrl) {
        formData.append("imageUrl", editingEvent.imageUrl); // Retain existing URL
      }

      if (editingEvent.id) {
        await axios.put("/api/events", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/events", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setEditingEvent(null);
      fetchEvents();
      setSuccessMessage(
        editingEvent.id
          ? "Event updated successfully!"
          : "Event added successfully!"
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      setLoading(true);
      await axios.delete(`/api/events?id=${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgenda = (index) => {
    const newAgenda = [...editingEvent.agenda];
    newAgenda.splice(index, 1);
    setEditingEvent({ ...editingEvent, agenda: newAgenda });
  };
  const handleDeleteHighlight = (index) => {
    const newHighlights = [...editingEvent.highlights];
    newHighlights.splice(index, 1);
    setEditingEvent({ ...editingEvent, highlights: newHighlights });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent({ ...editingEvent, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingEvent((prev) =>
          prev ? { ...prev, imageUrl: reader.result, imageFile: file } : null
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...editingEvent.highlights];
    newHighlights[index] = value;
    setEditingEvent({ ...editingEvent, highlights: newHighlights });
  };
  const handleAgendaChange = (index, name, value) => {
    const agendaArray = [...editingEvent.agenda];
    agendaArray[index][name] = value;
    setEditingEvent({ ...editingEvent, agenda: agendaArray });
  };

  const handleAddHighlight = () => {
    setEditingEvent({
      ...editingEvent,
      highlights: [...editingEvent.highlights, ""],
    });
  };
  const handleAddAgenda = () => {
    setEditingEvent({
      ...editingEvent,
      agenda: [
        ...editingEvent?.agenda,
        {
          time: "",
          session: "",
          speaker: "",
        },
      ],
    });
  };

  const handleAddEvent = () => {
    setEditingEvent({
      title: "",
      date: "",
      price: "",
      duration: "",
      description: "",
      summaryDescription: "",
      imageUrl: "",
      imageFile: null,
      highlights: [],
      location: "",
      organizer: "",
      agenda: [],
    });
  };

 

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Events</h1>
      {successMessage && (
        <div
          className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <button
        onClick={handleAddEvent}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
      >
        <FaPlus className="inline mr-2" /> Add New Event
      </button>

      {loading && <p>Loading...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
            <img
              src={event.image ? event.image : event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-2">{event.date}</p>
            <p className="text-gray-800 mb-2">{event.price}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditEvent(event)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() => router.push(`/event/${event.id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                <FaEye className="inline mr-2" /> View Details
              </button>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
     
      {editingEvent && (
        <AdminDialog
          title={editingEvent.id ? "Edit Event" : "Add New Event"}
          onClose={() => setEditingEvent(null)}
          onSubmit={() => handleUpdateEvent()}
          submitBtnLabel={editingEvent.id ? "Update Event" : "Add Event"}
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
              value={editingEvent.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="date"
            >
              Date *
            </label>
            <input
              type="text"
              id="date"
              name="date"
              required
              value={editingEvent.date}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={editingEvent.price}
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
              value={editingEvent.duration}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="organizer"
            >
              Organizer *
            </label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              required
              value={editingEvent.organizer}
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
              value={editingEvent.description}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="summaryDescription"
            >
              Summary Description
            </label>
            <textarea
              id="summaryDescription"
              name="summaryDescription"
              value={editingEvent.summaryDescription}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="2"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="location"
            >
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={editingEvent.location}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
           <DialogMiniImage
              state={editingEvent}
              setState={setEditingEvent}
              handleImageChange={handleImageChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Agenda *
            </label>
            {editingEvent?.agenda &&
              editingEvent.agenda.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start mb-3 border shadow-sm p-3 rounded-md"
                >
                  <div className="mr-3 mt-1 flex-col">
                    <div
                      className="flex items-center justify-center text-blue-500 rounded-full bg-blue-100  "
                      style={{ padding: "0.41rem" }}
                    >
                      <FaCalendarAlt className=" text-xs" />
                    </div>

                    <div
                      className="flex items-center justify-center text-red-500 rounded-full bg-red-100 mt-2 "
                      style={{ padding: "0.41rem" }}
                    >
                      <FaTrash
                        className=" text-xs cursor-pointer"
                        onClick={() => handleDeleteAgenda(index)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="mb-3">
                      <p className="text-gray-700 text-sm font-bold mb-1">
                        Session{" "}
                      </p>
                      <input
                        type="text"
                        value={item.session}
                        name="session"
                        onChange={(e) =>
                          handleAgendaChange(index, "session", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm "
                      />
                    </div>

                    <div className="mb-3">
                      <p className="text-gray-700 text-sm font-bold mb-1">
                        Speaker{" "}
                      </p>
                      <input
                        type="text"
                        value={item.speaker}
                        name="speaker"
                        onChange={(e) =>
                          handleAgendaChange(index, "speaker", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                      />
                    </div>
                    <div className="mb-3">
                      <p className="text-gray-700 text-sm font-bold mb-1">
                        Time{" "}
                      </p>
                      <input
                        type="text"
                        value={item.time}
                        name="time"
                        onChange={(e) =>
                          handleAgendaChange(index, "time", e.target.value)
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            <button
              type="button"
              onClick={handleAddAgenda}
              className="mt-2 bg-blue-500 text-xs text-white px-4 py-2 flex items-center  rounded-full hover:bg-blue-600 transition duration-300"
            >
              <FaPlus className="inline mr-1" /> Add Agenda
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Highlights *
            </label>
            {editingEvent?.highlights &&
              editingEvent.highlights.map((highlight, index) => (
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
        </AdminDialog>
      )}
    </div>
  );
}
