import React, { useEffect, useState, createContext } from "react";
import API from "../api/axios";

export const UserContext = createContext({
  user: null,
  loading: true,
  events: [],
  setUser: () => {},
  setEvents: () => {},
  setLoading: () => {},
});

const Context = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  // ================= AUTH CHECK =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/checkauth");
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ================= FETCH EVENTS =================
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/event/get-events");
        setEvents(res.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };

    if (!loading) {
      fetchEvents();
    }
  }, [loading]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        events,
        setUser,
        setEvents,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default Context;
