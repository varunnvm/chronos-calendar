import React from 'react';
import { ChevronLeft, ChevronRight, Search, Menu } from 'lucide-react';
import './Header.css';

const Header = ({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  toggleSidebar
}) => {
  // Format Date Range Title based on Active View
  const getHeaderTitle = () => {
    if (activeView === 'month') {
      return currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    
    if (activeView === 'week') {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      
      const endOfWeek = new Date(selectedDate);
      endOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 6);
      
      const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
      const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });
      
      if (startOfWeek.getFullYear() !== endOfWeek.getFullYear()) {
        return `${startMonth} ${startOfWeek.getDate()}, ${startOfWeek.getFullYear()} – ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
      }
      
      if (startOfWeek.getMonth() !== endOfWeek.getMonth()) {
        return `${startMonth} ${startOfWeek.getDate()} – ${endMonth} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      }
      
      return `${startMonth} ${startOfWeek.getDate()} – ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
    }
    
    // Day View
    return selectedDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Navigations
  const handlePrev = () => {
    if (activeView === 'month') {
      const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      setCurrentMonth(nextMonth);
      setSelectedDate(nextMonth);
    } else if (activeView === 'week') {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(selectedDate.getDate() - 7);
      setSelectedDate(nextWeek);
      setCurrentMonth(nextWeek);
    } else {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() - 1);
      setSelectedDate(nextDay);
      setCurrentMonth(nextDay);
    }
  };

  const handleNext = () => {
    if (activeView === 'month') {
      const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
      setCurrentMonth(nextMonth);
      setSelectedDate(nextMonth);
    } else if (activeView === 'week') {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(selectedDate.getDate() + 7);
      setSelectedDate(nextWeek);
      setCurrentMonth(nextWeek);
    } else {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      setSelectedDate(nextDay);
      setCurrentMonth(nextDay);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // View indicators width/left calculation for slider
  const getIndicatorStyle = () => {
    const views = ['month', 'week', 'day'];
    const idx = views.indexOf(activeView);
    // On desktop, buttons are fixed size (width: 76px, padded by 2px margin)
    // On mobile, they are flex 1, handled via CSS styles.
    // For pure JS inline translation:
    return {
      left: `calc(2px + ${idx} * (100% / 3))`,
      width: 'calc((100% - 4px) / 3)'
    };
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger Menu Toggle (Mobile) */}
        <button className="btn-icon header-menu-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>

        {/* Navigation Actions */}
        <div className="header-nav">
          <button className="btn-secondary" style={{ padding: '8px 12px' }} onClick={handleToday}>
            Today
          </button>
          <button className="btn-icon" onClick={handlePrev}>
            <ChevronLeft size={16} />
          </button>
          <button className="btn-icon" onClick={handleNext}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Selected Date String */}
        <h2 className="header-date-title">{getHeaderTitle()}</h2>
      </div>

      <div className="header-right">
        {/* Search Bar */}
        <div className="header-search">
          <Search size={14} className="header-search-icon" />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Segmented View Control */}
        <div className="view-selector">
          <div 
            className="view-btn-indicator" 
            style={getIndicatorStyle()} 
          />
          <button 
            className={`view-btn ${activeView === 'month' ? 'active' : ''}`}
            onClick={() => setActiveView('month')}
          >
            Month
          </button>
          <button 
            className={`view-btn ${activeView === 'week' ? 'active' : ''}`}
            onClick={() => setActiveView('week')}
          >
            Week
          </button>
          <button 
            className={`view-btn ${activeView === 'day' ? 'active' : ''}`}
            onClick={() => setActiveView('day')}
          >
            Day
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
