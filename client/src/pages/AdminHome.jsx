import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { UserContext } from "../../context/Context";
import Spinner from "../components/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "../components/EventCard";
import Button from "../components/ui/Button";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import ScrollReveal from "../components/ui/ScrollReveal";
import API from "../../api/axios";
import toast from "react-hot-toast";

const AdminHome = () => {
  const { user, loading: userLoading, events, setEvents, setLoading } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [adminLoading, setAdminLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // ================= FETCH ADMIN EVENTS =================
  const fetchAdminEvents = useCallback(async () => {
    if (!user || user.role !== "admin") return;

    try {
      setAdminLoading(true);
      const res = await API.get("/event/get-admin-events");
      setEvents(res.data.events || []);
    } catch (error) {
      console.error("Error fetching admin events:", error);
      setEvents([]);
      toast.error("Failed to load events");
    } finally {
      setAdminLoading(false);
    }
  }, [user, setEvents]);

  // ================= DELETE EVENT =================
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setIsDeleting(true);
      await API.delete(`/event/delete-event/${id}`);
      toast.success("Event deleted");
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  }, [setEvents]);

  // ================= EDIT EVENT =================
  const handleEdit = useCallback((event) => {
    setEditingEvent(event);
    setEditFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().slice(0, 16),
      totalSeats: event.totalSeats,
      price: event.price,
      img: event.img || "",
    });
  }, []);

  // ================= UPDATE EVENT =================
  const handleUpdate = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      const res = await API.put(`/event/update-event/${editingEvent._id}`, editFormData);
      toast.success("Event updated successfully");
      
      setEvents((prev) =>
        prev.map((event) =>
          event._id === editingEvent._id ? res.data.data : event
        )
      );
      
      setEditingEvent(null);
      setEditFormData({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  }, [editingEvent, editFormData, setEvents]);

  // ================= HANDLE EDIT FORM CHANGE =================
  const handleEditChange = useCallback((e) => {
    setEditFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  // ================= CANCEL EDIT =================
  const handleCancelEdit = useCallback(() => {
    setEditingEvent(null);
    setEditFormData({});
  }, []);

  // ================= LOGOUT =================
  const handleLogout = useCallback(async () => {
    try {
      await API.post("/auth/signout");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  }, [navigate]);

  // Memoized stats for better performance
  const stats = useMemo(() => ({
    totalEvents: events?.length || 0,
    totalBookings: events?.reduce((sum, event) => sum + (event.totalSeats - event.availableSeats), 0) || 0,
    totalRevenue: events?.reduce((sum, event) => sum + ((event.totalSeats - event.availableSeats) * event.price), 0) || 0
  }), [events]);

  // Combined loading state
  const isLoading = userLoading || adminLoading;

  // ================= EFFECTS =================
  useEffect(() => {
    fetchAdminEvents();
  }, [fetchAdminEvents]);

  useEffect(() => {
    if (!user) return;
    if (user.role === "user") {
      navigate("/");
    }
  }, [user, navigate]);

  // Early return after all hooks
  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Admin Header */}
        <ScrollReveal direction="down" delay={0.1}>
          <Card className="mb-8 glass-effect">
            <CardBody className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gradient">
                    Welcome back, {user.name}
                  </h1>
                  <p className="text-slate-400">{user.email}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">Admin Dashboard</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="danger"
                      onClick={handleLogout}
                      disabled={isDeleting}
                      className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2"
                    >
                      {isDeleting ? (
                        <>
                          <Spinner size="small" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto"
                  >
                    <Link to="/create-event" className="block w-full sm:w-auto">
                      <Button 
                        variant="primary" 
                        className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Event
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </CardBody>
          </Card>
        </ScrollReveal>

        {/* Stats Cards */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card glass>
              <CardBody className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stats.totalEvents}
                </div>
                <div className="text-slate-300">Total Events</div>
              </CardBody>
            </Card>
            
            <Card glass>
              <CardBody className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {stats.totalBookings}
                </div>
                <div className="text-slate-300">Total Bookings</div>
              </CardBody>
            </Card>
            
            <Card glass>
              <CardBody className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  ${stats.totalRevenue.toLocaleString()}
                </div>
                <div className="text-slate-300">Total Revenue</div>
              </CardBody>
            </Card>
          </div>
        </ScrollReveal>

        {/* Events Section */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Manage Events</h2>
              <div className="text-sm text-slate-400">
                {events.length} {events.length === 1 ? 'event' : 'events'}
              </div>
            </div>

            {events.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <EventCard
                      event={event}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card glass className="text-center py-8 sm:py-12">
                <CardBody>
                  <div className="text-4xl sm:text-6xl mb-4">📅</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Events Yet</h3>
                  <p className="text-slate-300 mb-6 text-sm sm:text-base">Create your first event to get started</p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-block"
                  >
                    <Link to="/create-event" className="block">
                      <Button 
                        variant="primary" 
                        className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Your First Event
                      </Button>
                    </Link>
                  </motion.div>
                </CardBody>
              </Card>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {editingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="glass-effect rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-gradient">Edit Event</h2>
              </div>
              
              <form onSubmit={handleUpdate} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={editFormData.date}
                      onChange={handleEditChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Total Seats
                    </label>
                    <input
                      type="number"
                      name="totalSeats"
                      value={editFormData.totalSeats}
                      onChange={handleEditChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
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
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    name="img"
                    value={editFormData.img}
                    onChange={handleEditChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full text-sm sm:text-base py-2.5 sm:py-3 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Event
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancelEdit}
                      className="w-full text-sm sm:text-base py-2.5 sm:py-3 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHome;
