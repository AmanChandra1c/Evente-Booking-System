import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/Context";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import API from "../../api/axios";
import toast from "react-hot-toast";

const AdminHome = () => {
  const { user, loading, events, setEvents, setLoading } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // ================= FETCH ADMIN EVENTS =================
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchAdminEvents = async () => {
      try {
        setLoading(true);
        const res = await API.get("/event/get-admin-events");
        setEvents(res.data.events); // ✅ matches backend
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminEvents();
  }, [user]);

  // ================= DELETE EVENT =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/event/delete-event/${id}`);
      toast.success("Event deleted");

      // 🔥 Remove from UI instantly
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // ================= EDIT EVENT =================
  const handleEdit = (event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().slice(0, 16), // Format for datetime-local input
      totalSeats: event.totalSeats,
      price: event.price,
      img: event.img || "",
    });
  };

  // ================= UPDATE EVENT =================
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const res = await API.put(`/event/update-event/${editingEvent._id}`, editFormData);
      
      toast.success("Event updated successfully");
      
      // Update events in state
      setEvents((prev) =>
        prev.map((event) =>
          event._id === editingEvent._id ? res.data.data : event
        )
      );
      
      // Close edit form
      setEditingEvent(null);
      setEditFormData({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // ================= HANDLE EDIT FORM CHANGE =================
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CANCEL EDIT =================
  const handleCancelEdit = () => {
    setEditingEvent(null);
    setEditFormData({});
  };

  if (loading) return <Loading />;

  useEffect(() => {
    if (!user) return;

    if (user.role === "user") {
      navigate("/");
    }
  }, [user, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 container mx-auto">
      {/* Admin Info */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user.name} 👋
            </h1>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={async () => {
                try {
                  await API.post("/auth/signout");
                  toast.success("Logged out successfully");
                  navigate("/login");
                } catch (error) {
                  toast.error("Logout failed");
                }
              }}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
            <Link
              to="/create-event"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              + Create Event
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Event</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={editFormData.totalSeats}
                    onChange={handleEditChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  name="img"
                  value={editFormData.img}
                  onChange={handleEditChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Update Event
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events */}
      <h2 className="text-xl font-semibold mb-4">Manage Events</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-500">No events found</p>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
