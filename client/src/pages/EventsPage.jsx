import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactDOM from "react-dom";
import Navbar from "../components/Navbar";
import EventsUserCard from "../components/EventUserCard";
import { Card, CardBody } from "../components/ui/Card";
import ScrollReveal from "../components/ui/ScrollReveal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { UserContext } from "../../context/Context";

const EventsPage = () => {
  const { events = [], loading } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [activeFilters, setActiveFilters] = useState({
    title: false,
    location: false,
    date: false,
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedOptions, setSelectedOptions] = useState({
    title: "",
    location: "",
    date: "",
  });

  const dropdownRefs = {
    title: useRef(null),
    location: useRef(null),
    date: useRef(null),
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && dropdownRefs[dropdownOpen]?.current && 
          !dropdownRefs[dropdownOpen].current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Get unique options for dropdowns
  const getTitleOptions = () => {
    const titles = [...new Set(events.map(event => event.title))];
    return titles.sort();
  };

  const getLocationOptions = () => {
    const locations = [...new Set(events.map(event => event.location))];
    return locations.sort();
  };

  const getDateOptions = () => {
    const dates = [...new Set(events.map(event => 
      new Date(event.date).toLocaleDateString()
    ))];
    return dates.sort((a, b) => new Date(a) - new Date(b));
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      let matches = true;
      
      // Apply title filter
      if (selectedOptions.title) {
        matches = matches && event.title.toLowerCase().includes(selectedOptions.title.toLowerCase());
      }
      
      // Apply location filter
      if (selectedOptions.location) {
        matches = matches && event.location.toLowerCase().includes(selectedOptions.location.toLowerCase());
      }
      
      // Apply date filter
      if (selectedOptions.date) {
        const eventDateStr = new Date(event.date).toLocaleDateString();
        matches = matches && eventDateStr === selectedOptions.date;
      }
      
      // Apply search term based on search type
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        let searchMatches = false;
        
        switch (searchType) {
          case 'title':
            searchMatches = event.title.toLowerCase().includes(searchLower);
            break;
          case 'location':
            searchMatches = event.location.toLowerCase().includes(searchLower);
            break;
          case 'date':
            searchMatches = new Date(event.date).toLocaleDateString().toLowerCase().includes(searchLower);
            break;
          case 'all':
          default:
            searchMatches = event.title.toLowerCase().includes(searchLower) ||
                           event.description.toLowerCase().includes(searchLower) ||
                           event.location.toLowerCase().includes(searchLower) ||
                           new Date(event.date).toLocaleDateString().toLowerCase().includes(searchLower);
            break;
        }
        
        matches = matches && searchMatches;
      }
      
      return matches;
    });
  }, [events, searchTerm, searchType, selectedOptions]);

  const toggleDropdown = (filterType) => {
    if (dropdownOpen === filterType) {
      setDropdownOpen(null);
    } else {
      const buttonRef = dropdownRefs[filterType];
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX
        });
      }
      setDropdownOpen(filterType);
    }
  };

  const selectOption = (filterType, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value
    }));
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value ? true : false
    }));
    setDropdownOpen(null);
  };

  const clearAllFilters = () => {
    setSelectedOptions({
      title: "",
      location: "",
      date: "",
    });
    setActiveFilters({
      title: false,
      location: false,
      date: false,
    });
    setSearchTerm("");
    setSearchType("all");
  };

  // Portal-based dropdown component
  const PortalDropdown = ({ type, options, onSelect, selectedValue, label, icon, color }) => {
    if (dropdownOpen !== type) return null;

    return ReactDOM.createPortal(
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed w-64 sm:w-72 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl z-[9999] max-h-60 overflow-y-auto"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`
        }}
      >
        <div className="p-3">
          <p className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-2">
            {icon}
            {label}
          </p>
          <div className="space-y-1">
            {options.length > 0 ? (
              options.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    onSelect(type, option);
                    setDropdownOpen(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-slate-700/50 transition-all duration-200 ${
                    selectedValue === option ? `${color} font-medium border border-opacity-30` : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-slate-500 px-3 py-2 text-center">No options available</p>
            )}
          </div>
        </div>
      </motion.div>,
      document.body
    );
  };

  const hasActiveFilters = selectedOptions.title || selectedOptions.location || selectedOptions.date;
  const activeFilterCount = Object.values(selectedOptions).filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16M4 4H8v16M8 4H4z" />
            </svg>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {/* Hero Section */}
      <ScrollReveal direction="down" delay={0.1}>
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div className="absolute inset-0">
              <div className="h-full w-full opacity-20">
                <div className="h-full w-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
                <div className="h-full w-full bg-gradient-to-tr from-pink-600/5 via-blue-600/5 to-purple-600/5"></div>
                <div className="h-full w-full bg-gradient-to-bl from-purple-600/3 via-blue-600/3 to-pink-600/3"></div>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <h1 className="text-5xl md:text-6xl font-black text-gradient mb-4">
                  Events 🎉
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Discover and book events happening near you
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Search and Filter Section */}
      <ScrollReveal direction="up" delay={0.2} className="overflow-visible">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 overflow-visible">
          <Card glass>
            <CardBody className="p-6 overflow-visible">
              {/* Enhanced Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Main Search Input */}
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search by title, location, or date..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800/60 border border-slate-600 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm sm:text-base"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 hover:text-slate-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Search Type Selector */}
                    <div className="flex gap-2">
                      <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="px-3 py-2.5 sm:py-3 bg-slate-800/60 border border-slate-600 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm sm:text-base min-w-[100px]"
                      >
                        <option value="all">All Fields</option>
                        <option value="title">Title</option>
                        <option value="location">Location</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Search Tips */}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Try: "Conference", "New York", "Dec 25"
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Use filters below for precise results</span>
                  </div>
                </div>
              </div>

              {/* Filter Icons with Dropdowns */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-medium text-slate-300">Filters:</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3 relative z-10" style={{ overflow: 'visible' }}>
                    {/* Title Filter Button */}
                    <div className="relative" ref={dropdownRefs.title}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleDropdown('title')}
                        className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-300 ${
                          activeFilters.title
                            ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border-2 border-blue-500/50 shadow-lg shadow-blue-500/25"
                            : "bg-slate-800/60 text-slate-400 border-2 border-slate-600 hover:bg-slate-700/60 hover:border-slate-500"
                        }`}
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">Title</span>
                        {selectedOptions.title && (
                          <span className="text-xs bg-blue-500/30 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-blue-500/50">1</span>
                        )}
                        <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 ${dropdownOpen === 'title' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Location Filter Button */}
                    <div className="relative" ref={dropdownRefs.location}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleDropdown('location')}
                        className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-300 ${
                          activeFilters.location
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-400 border-2 border-green-500/50 shadow-lg shadow-green-500/25"
                            : "bg-slate-800/60 text-slate-400 border-2 border-slate-600 hover:bg-slate-700/60 hover:border-slate-500"
                        }`}
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">Location</span>
                        {selectedOptions.location && (
                          <span className="text-xs bg-green-500/30 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-green-500/50">1</span>
                        )}
                        <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 ${dropdownOpen === 'location' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Date Filter Button */}
                    <div className="relative" ref={dropdownRefs.date}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleDropdown('date')}
                        className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-300 ${
                          activeFilters.date
                            ? "bg-gradient-to-r from-purple-500/20 to-pink-600/20 text-purple-400 border-2 border-purple-500/50 shadow-lg shadow-purple-500/25"
                            : "bg-slate-800/60 text-slate-400 border-2 border-slate-600 hover:bg-slate-700/60 hover:border-slate-500"
                        }`}
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">Date</span>
                        {selectedOptions.date && (
                          <span className="text-xs bg-purple-500/30 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-purple-500/50">1</span>
                        )}
                        <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 ${dropdownOpen === 'date' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  {/* Clear Button */}
                  {(hasActiveFilters || searchTerm) && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        size="sm"
                        className="px-3 py-2 sm:px-4 text-xs sm:text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Clear All
                        </span>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedOptions.title && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs sm:text-sm border border-blue-500/30"
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="truncate max-w-20 sm:max-w-none">{selectedOptions.title}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => selectOption('title', '')}
                        className="ml-1 hover:text-blue-300 transition-colors"
                      >
                        ×
                      </motion.button>
                    </motion.span>
                  )}
                  {selectedOptions.location && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm border border-green-500/30"
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate max-w-20 sm:max-w-none">{selectedOptions.location}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => selectOption('location', '')}
                        className="ml-1 hover:text-green-300 transition-colors"
                      >
                        ×
                      </motion.button>
                    </motion.span>
                  )}
                  {selectedOptions.date && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs sm:text-sm border border-purple-500/30"
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate max-w-16 sm:max-w-none">{selectedOptions.date}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => selectOption('date', '')}
                        className="ml-1 hover:text-purple-300 transition-colors"
                      >
                        ×
                      </motion.button>
                    </motion.span>
                  )}
                </div>
              )}

              {/* Results Count */}
              {(searchTerm || hasActiveFilters) && (
                <div className="mt-4 text-center sm:text-left">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-600/50"
                  >
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs sm:text-sm text-slate-300">
                      {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                    </span>
                  </motion.div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </ScrollReveal>

      {/* Events Grid */}
      <ScrollReveal direction="up" delay={0.3}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 pb-12 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full"
                >
                  <EventsUserCard event={event} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <Card glass className="text-center py-8 sm:py-12 md:py-16">
                  <CardBody className="px-4 sm:px-6 md:px-8">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🔍</div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                      No events found
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-6 max-w-md mx-auto">
                      {searchTerm || hasActiveFilters
                        ? "Try adjusting your search or filters"
                        : "No events available at the moment"}
                    </p>
                    {(searchTerm || hasActiveFilters) && (
                      <Button
                        variant="primary"
                        onClick={clearAllFilters}
                        className="mx-auto px-6 py-3 sm:px-8 sm:py-3"
                      >
                        Clear Search & Filters
                      </Button>
                    )}
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Portal Dropdowns - rendered outside any parent containers */}
      <PortalDropdown
        type="title"
        options={getTitleOptions()}
        onSelect={selectOption}
        selectedValue={selectedOptions.title}
        label="Select Event Title"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        }
        color="bg-blue-500/20 text-blue-400 border border-blue-500/30"
      />

      <PortalDropdown
        type="location"
        options={getLocationOptions()}
        onSelect={selectOption}
        selectedValue={selectedOptions.location}
        label="Select Location"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        color="bg-green-500/20 text-green-400 border border-green-500/30"
      />

      <PortalDropdown
        type="date"
        options={getDateOptions()}
        onSelect={selectOption}
        selectedValue={selectedOptions.date}
        label="Select Date"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        color="bg-purple-500/20 text-purple-400 border border-purple-500/30"
      />
    </div>
  );
};

export default EventsPage;
