import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import EventDrawer from './components/EventDrawer';
import './App.css';

// Demo Events Setup
const getDemoEvents = () => {
  const today = new Date();
  const format = (d) => d.toISOString().split('T')[0];

  const dToday = format(today);
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dYesterday = format(yesterday);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dTomorrow = format(tomorrow);

  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7));
  const dNextFriday = format(nextFriday);

  return [
    {
      id: 'demo-1',
      title: 'Project Kickoff Sync 🚀',
      description: 'Discussing goals, architecture, and timeline for the new React client app.',
      date: dToday,
      startTime: '10:00',
      endTime: '11:30',
      category: 'work'
    },
    {
      id: 'demo-2',
      title: 'Morning Gym Cardio 🏃‍♂️',
      description: 'Interval running on treadmill followed by core strength training.',
      date: dToday,
      startTime: '07:00',
      endTime: '08:00',
      category: 'health'
    },
    {
      id: 'demo-3',
      title: 'Framer Motion Design Session 🎨',
      description: 'Learning animation keyframes and designing sleek drawer transitions.',
      date: dTomorrow,
      startTime: '14:00',
      endTime: '15:30',
      category: 'study'
    },
    {
      id: 'demo-4',
      title: 'Dinner & Board Games 🎲',
      description: 'Weekly hangouts with friends. Bringing Settlers of Catan!',
      date: dNextFriday,
      startTime: '19:00',
      endTime: '22:00',
      category: 'social'
    },
    {
      id: 'demo-5',
      title: 'Code Review & PR Audit 💻',
      description: 'Going through frontend repository pull requests and refactoring styles.',
      date: dYesterday,
      startTime: '15:00',
      endTime: '16:30',
      category: 'work'
    }
  ];
};

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeView, setActiveView] = useState('month'); // 'month' | 'week' | 'day'
  
  // Local storage state
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('chronos_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved events', e);
      }
    }
    return getDemoEvents();
  });

  useEffect(() => {
    localStorage.setItem('chronos_events', JSON.stringify(events));
  }, [events]);

  // Filters
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState([
    'work', 'personal', 'health', 'study', 'social'
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer / Editing Event State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Responsive Sidebar Drawer (mobile toggle)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Event CRUD operations
  const handleAddOrUpdateEvent = (eventData) => {
    if (eventData.id) {
      // Edit
      setEvents(events.map(ev => ev.id === eventData.id ? eventData : ev));
    } else {
      // Add
      const newEvent = {
        ...eventData,
        id: 'evt-' + Math.random().toString(36).substr(2, 9)
      };
      setEvents([...events, newEvent]);
    }
    setIsDrawerOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(ev => ev.id !== eventId));
    setIsDrawerOpen(false);
    setEditingEvent(null);
  };

  const handleOpenAddDrawer = (prefilledDate = null, prefilledTime = null) => {
    const formattedDate = prefilledDate 
      ? prefilledDate.toISOString().split('T')[0]
      : selectedDate.toISOString().split('T')[0];
      
    setEditingEvent({
      title: '',
      description: '',
      date: formattedDate,
      startTime: prefilledTime || '09:00',
      endTime: prefilledTime ? calculateEndTime(prefilledTime) : '10:00',
      category: 'work'
    });
    setIsDrawerOpen(true);
  };

  const calculateEndTime = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const newH = (h + 1) % 24;
    return `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleOpenEditDrawer = (event) => {
    setEditingEvent(event);
    setIsDrawerOpen(true);
  };

  // Filtered Events helper
  const filteredEvents = events.filter(ev => {
    const categoryMatches = selectedCategoryFilters.includes(ev.category);
    const queryMatches = 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.description && ev.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatches && queryMatches;
  });

  return (
    <div className="calendar-layout">
      {/* Sidebar - responsive layout container handles desktop view, and overlay for mobile */}
      <Sidebar 
        selectedDate={selectedDate}
        setSelectedDate={(date) => {
          setSelectedDate(date);
          setCurrentMonth(date);
        }}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        selectedCategoryFilters={selectedCategoryFilters}
        setSelectedCategoryFilters={setSelectedCategoryFilters}
        events={events}
        onOpenAddDrawer={() => handleOpenAddDrawer()}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Workspace */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', width: '100%' }}>
        <Header 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          activeView={activeView}
          setActiveView={setActiveView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* View Grid Container */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {activeView === 'month' && (
            <MonthView 
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              events={filteredEvents}
              onCellClick={(date) => {
                setSelectedDate(date);
                handleOpenAddDrawer(date);
              }}
              onEventClick={handleOpenEditDrawer}
            />
          )}

          {activeView === 'week' && (
            <WeekView 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              events={filteredEvents}
              onHourClick={(date, hourStr) => {
                setSelectedDate(date);
                handleOpenAddDrawer(date, hourStr);
              }}
              onEventClick={handleOpenEditDrawer}
            />
          )}

          {activeView === 'day' && (
            <DayView 
              selectedDate={selectedDate}
              events={filteredEvents}
              onHourClick={(date, hourStr) => {
                handleOpenAddDrawer(date, hourStr);
              }}
              onEventClick={handleOpenEditDrawer}
            />
          )}
        </div>
      </div>

      {/* Slide-out Event Detail Drawer */}
      <EventDrawer 
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSave={handleAddOrUpdateEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}

export default App;
