import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, X } from 'lucide-react';
import './Sidebar.css';

const CATEGORIES = [
  { id: 'work', name: 'Work', color: 'var(--color-work)' },
  { id: 'personal', name: 'Personal', color: 'var(--color-personal)' },
  { id: 'health', name: 'Health', color: 'var(--color-health)' },
  { id: 'study', name: 'Study', color: 'var(--color-study)' },
  { id: 'social', name: 'Social', color: 'var(--color-social)' }
];

const Sidebar = ({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  selectedCategoryFilters,
  setSelectedCategoryFilters,
  events,
  onOpenAddDrawer,
  isOpen,
  setIsOpen
}) => {
  // Calendar math for Mini Calendar
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // First day of current month (0 = Sunday, 1 = Monday, ...)
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();

  // Number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Number of days in previous month
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Generate mini calendar days array
  const calendarCells = [];

  // Previous month padding days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const dateObj = new Date(year, month - 1, day);
    calendarCells.push({ day, dateObj, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    calendarCells.push({ day, dateObj, isCurrentMonth: true });
  }

  // Next month padding days (fill grid to multiple of 7, max 42 cells)
  const remainingCells = 42 - calendarCells.length;
  for (let day = 1; day <= remainingCells; day++) {
    const dateObj = new Date(year, month + 1, day);
    calendarCells.push({ day, dateObj, isCurrentMonth: false });
  }

  // Navigate mini calendar months
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Toggle category filters
  const handleToggleCategory = (catId) => {
    if (selectedCategoryFilters.includes(catId)) {
      if (selectedCategoryFilters.length > 1) {
        setSelectedCategoryFilters(selectedCategoryFilters.filter(id => id !== catId));
      } else {
        // Keep at least one selected, or select all if deselected last
        setSelectedCategoryFilters(CATEGORIES.map(c => c.id));
      }
    } else {
      setSelectedCategoryFilters([...selectedCategoryFilters, catId]);
    }
  };

  // Helper to count events per category
  const getCategoryCount = (catId) => {
    return events.filter(ev => ev.category === catId).length;
  };

  // Helper to format Date key as YYYY-MM-DD
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Check if a day has events
  const hasEvents = (date) => {
    const dateStr = formatDateKey(date);
    return events.some(ev => ev.date === dateStr);
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const today = new Date();

  // Stats text
  const todayEvents = events.filter(ev => ev.date === formatDateKey(today));
  const workCount = todayEvents.filter(ev => ev.category === 'work').length;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo & Mobile Close button */}
        <div className="sidebar-header">
          <Calendar size={22} style={{ color: 'var(--primary)' }} />
          <span className="sidebar-logo">Chronos</span>
          <button 
            className="btn-icon" 
            style={{ marginLeft: 'auto', display: isOpen ? 'flex' : 'none' }}
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Plus Event Button */}
        <button 
          className="btn-primary sidebar-btn-add"
          onClick={() => {
            onOpenAddDrawer();
            setIsOpen(false); // Close mobile menu if open
          }}
        >
          <Plus size={16} />
          Create Event
        </button>

        {/* Mini Calendar Widget */}
        <div className="mini-calendar">
          <div className="mini-cal-header">
            <span className="mini-cal-title">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <div className="mini-cal-nav">
              <button className="mini-cal-nav-btn" onClick={handlePrevMonth}>
                <ChevronLeft size={14} />
              </button>
              <button className="mini-cal-nav-btn" onClick={handleNextMonth}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="mini-cal-weekdays">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>

          <div className="mini-cal-days">
            {calendarCells.map((cell, idx) => {
              const selected = isSameDay(cell.dateObj, selectedDate);
              const currentToday = isSameDay(cell.dateObj, today);
              const eventDot = hasEvents(cell.dateObj);

              return (
                <div
                  key={idx}
                  className={`mini-cal-day-cell 
                    ${cell.isCurrentMonth ? '' : 'outside'} 
                    ${currentToday ? 'today' : ''} 
                    ${selected ? 'selected' : ''}
                  `}
                  onClick={() => {
                    setSelectedDate(cell.dateObj);
                    if (!cell.isCurrentMonth) {
                      setCurrentMonth(cell.dateObj);
                    }
                  }}
                >
                  {cell.day}
                  {eventDot && !selected && (
                    <span 
                      className="mini-cal-dot"
                      style={{ 
                        background: currentToday ? 'var(--primary)' : 'rgba(255,255,255,0.4)' 
                      }} 
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Section */}
        <div className="category-section">
          <h4 className="section-title">Categories</h4>
          <div className="category-list">
            {CATEGORIES.map(cat => {
              const active = selectedCategoryFilters.includes(cat.id);
              return (
                <div 
                  key={cat.id} 
                  className={`category-item ${active ? 'active' : ''}`}
                  onClick={() => handleToggleCategory(cat.id)}
                >
                  <div className="category-info">
                    <span 
                      className="category-dot" 
                      style={{ 
                        background: cat.color,
                        boxShadow: active ? `0 0 8px ${cat.color}` : 'none'
                      }} 
                    />
                    <span className="category-name">{cat.name}</span>
                  </div>
                  <span className="category-count">{getCategoryCount(cat.id)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Stats Widget */}
        <div className="stats-card">
          <h4 className="stats-title">Today's Schedule</h4>
          <p className="stats-description">
            {todayEvents.length === 0 
              ? "No events scheduled for today. Take some time to relax! ☕"
              : `You have ${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''} scheduled for today. ${workCount > 0 ? `(${workCount} work sync${workCount > 1 ? 's' : ''})` : ''}`
            }
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
