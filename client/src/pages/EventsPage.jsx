import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import EventsUserCard from "../components/EventUserCard";
import { UserContext } from "../../context/Context";

const EventsPage = () => {
  const { events = [], loading } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    title: false,
    location: false,
    date: false,
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);
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
      
      // Apply search term
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const searchMatches = event.title.toLowerCase().includes(searchLower) ||
                            event.description.toLowerCase().includes(searchLower);
        matches = matches && searchMatches;
      }
      
      return matches;
    });
  }, [events, searchTerm, selectedOptions]);

  const toggleDropdown = (filterType) => {
    setDropdownOpen(dropdownOpen === filterType ? null : filterType);
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
  };

  const hasActiveFilters = selectedOptions.title || selectedOptions.location || selectedOptions.date;
  const activeFilterCount = Object.values(selectedOptions).filter(Boolean).length;

  if (loading) {
    return <div className="text-center mt-20">Loading events...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 container mx-auto px-4">
      <Navbar />

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Events 🎉</h1>
        <p className="text-gray-500">
          Discover and book events happening near you
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        {/* Search Bar */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Events
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Icons with Dropdowns */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Filters:</span>
            
            {/* Title Filter Dropdown */}
            <div className="relative" ref={dropdownRefs.title}>
              <button
                onClick={() => toggleDropdown('title')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  activeFilters.title
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                    : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm font-medium">Title</span>
                {selectedOptions.title && (
                  <span className="text-xs bg-blue-200 px-2 py-1 rounded-full">1</span>
                )}
                <svg className={`w-3 h-3 transition-transform ${dropdownOpen === 'title' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen === 'title' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-500 mb-2">Select Event Title</p>
                    {getTitleOptions().map(title => (
                      <button
                        key={title}
                        onClick={() => selectOption('title', title)}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                          selectedOptions.title === title ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {title}
                      </button>
                    ))}
                    {getTitleOptions().length === 0 && (
                      <p className="text-sm text-gray-500 px-3 py-2">No titles available</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Location Filter Dropdown */}
            <div className="relative" ref={dropdownRefs.location}>
              <button
                onClick={() => toggleDropdown('location')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  activeFilters.location
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Location</span>
                {selectedOptions.location && (
                  <span className="text-xs bg-green-200 px-2 py-1 rounded-full">1</span>
                )}
                <svg className={`w-3 h-3 transition-transform ${dropdownOpen === 'location' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen === 'location' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-500 mb-2">Select Location</p>
                    {getLocationOptions().map(location => (
                      <button
                        key={location}
                        onClick={() => selectOption('location', location)}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                          selectedOptions.location === location ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                    {getLocationOptions().length === 0 && (
                      <p className="text-sm text-gray-500 px-3 py-2">No locations available</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Date Filter Dropdown */}
            <div className="relative" ref={dropdownRefs.date}>
              <button
                onClick={() => toggleDropdown('date')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  activeFilters.date
                    ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                    : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Date</span>
                {selectedOptions.date && (
                  <span className="text-xs bg-purple-200 px-2 py-1 rounded-full">1</span>
                )}
                <svg className={`w-3 h-3 transition-transform ${dropdownOpen === 'date' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen === 'date' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-500 mb-2">Select Date</p>
                    {getDateOptions().map(date => (
                      <button
                        key={date}
                        onClick={() => selectOption('date', date)}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                          selectedOptions.date === date ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                    {getDateOptions().length === 0 && (
                      <p className="text-sm text-gray-500 px-3 py-2">No dates available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clear Button */}
          {(hasActiveFilters || searchTerm) && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedOptions.title && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {selectedOptions.title}
                <button
                  onClick={() => selectOption('title', '')}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedOptions.location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selectedOptions.location}
                <button
                  onClick={() => selectOption('location', '')}
                  className="ml-1 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedOptions.date && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {selectedOptions.date}
                <button
                  onClick={() => selectOption('date', '')}
                  className="ml-1 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        {(searchTerm || hasActiveFilters) && (
          <div className="mt-4 text-sm text-gray-600">
            Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} 
            {hasActiveFilters && ` with ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventsUserCard key={event._id} event={event} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              {searchTerm || hasActiveFilters
                ? "Try adjusting your search or filters"
                : "No events available at the moment"}
            </p>
            {(searchTerm || hasActiveFilters) && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
