import React, { useEffect, useRef } from 'react';
import './WeekView.css';

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CATEGORY_STYLES = {
  work: { bg: 'rgba(99, 102, 241, 0.15)', text: '#a5b4fc', border: 'var(--color-work)' },
  personal: { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', border: 'var(--color-personal)' },
  health: { bg: 'rgba(244, 63, 94, 0.15)', text: '#fda4af', border: 'var(--color-health)' },
  study: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fde047', border: 'var(--color-study)' },
  social: { bg: 'rgba(6, 182, 212, 0.15)', text: '#67e8f9', border: 'var(--color-social)' }
};

const WeekView = ({
  selectedDate,
  setSelectedDate,
  events,
  onHourClick,
  onEventClick
}) => {
  const scrollContainerRef = useRef(null);

  // Auto-scroll to 7:00 AM on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 420; // 7 hours * 60px
    }
  }, []);

  // Calculate start of the week (Sunday)
  const getStartOfWeek = (d) => {
    const day = d.getDay();
    const temp = new Date(d);
    temp.setDate(d.getDate() - day);
    return temp;
  };

  const startOfWeek = getStartOfWeek(selectedDate);

  // Array of the 7 days of this week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    return dayDate;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Date key formatter: YYYY-MM-DD
  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // Helper to convert time "HH:MM" to minutes from midnight
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const today = new Date();

  // Find if today is in the current week
  const isTodayInWeek = weekDays.some((day) => isSameDay(day, today));
  const currentMinutes = today.getHours() * 60 + today.getMinutes();

  return (
    <div className="week-view fade-in">
      {/* Week Header */}
      <div className="week-header">
        <div className="week-header-space" />
        {weekDays.map((day, idx) => {
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div 
              key={idx} 
              className={`week-header-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDate(day)}
              style={{ cursor: 'pointer' }}
            >
              <span>{WEEKDAYS_SHORT[day.getDay()]}</span>
              <span className="week-header-day-num">{day.getDate()}</span>
            </div>
          );
        })}
      </div>

      {/* Grid Container */}
      <div className="week-grid-container" ref={scrollContainerRef}>
        <div className="week-grid">
          {/* Current time red line */}
          {isTodayInWeek && (
            <div 
              className="week-current-time-line" 
              style={{ top: `${currentMinutes}px` }}
            />
          )}

          {/* Time markings (Background Rows) */}
          {hours.map((hour) => {
            const displayHour = hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
            return (
              <div key={hour} className="week-hour-row">
                <span className="week-time-label">{displayHour}</span>
              </div>
            );
          })}

          {/* Spacer Column for hours */}
          <div style={{ borderRight: '1px solid var(--border-light)', gridRow: '1 / -1' }} />

          {/* 7 Columns for weekdays */}
          {weekDays.map((day, dayIdx) => {
            const dateStr = formatDateKey(day);
            const dayEvents = events.filter((ev) => ev.date === dateStr);

            return (
              <div key={dayIdx} className="week-day-column">
                {/* Clickable cells background for event adding */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="week-grid-cell-click"
                    style={{ top: `${hour * 60}px` }}
                    onClick={() => {
                      const hourStr = `${String(hour).padStart(2, '0')}:00`;
                      onHourClick(day, hourStr);
                    }}
                  />
                ))}

                {/* Event Cards */}
                {dayEvents.map((ev) => {
                  const startMins = timeToMinutes(ev.startTime);
                  const endMins = timeToMinutes(ev.endTime);
                  const duration = Math.max(30, endMins - startMins); // at least 30 mins block
                  const styleColors = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES.work;

                  return (
                    <div
                      key={ev.id}
                      className="week-event-card"
                      style={{
                        top: `${startMins}px`,
                        height: `${duration}px`,
                        background: styleColors.bg,
                        color: styleColors.text,
                        borderLeft: `3px solid ${styleColors.border}`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(ev);
                      }}
                    >
                      <span className="week-event-title">{ev.title}</span>
                      <span className="week-event-time">
                        {ev.startTime} – {ev.endTime}
                      </span>
                      {duration >= 50 && ev.description && (
                        <span className="week-event-desc">{ev.description}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
