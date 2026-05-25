import React, { useEffect, useRef } from 'react';
import './DayView.css';

const CATEGORY_STYLES = {
  work: { bg: 'rgba(99, 102, 241, 0.15)', text: '#a5b4fc', border: 'var(--color-work)' },
  personal: { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', border: 'var(--color-personal)' },
  health: { bg: 'rgba(244, 63, 94, 0.15)', text: '#fda4af', border: 'var(--color-health)' },
  study: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fde047', border: 'var(--color-study)' },
  social: { bg: 'rgba(6, 182, 212, 0.15)', text: '#67e8f9', border: 'var(--color-social)' }
};

const DayView = ({
  selectedDate,
  events,
  onHourClick,
  onEventClick
}) => {
  const scrollContainerRef = useRef(null);

  // Auto-scroll to 7:00 AM on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 490; // 7 hours * 70px
    }
  }, [selectedDate]);

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

  const dateStr = formatDateKey(selectedDate);
  const dayEvents = events.filter((ev) => ev.date === dateStr);

  const today = new Date();
  const isSelectedToday = isSameDay(selectedDate, today);

  // Convert current time to pixels: 70px per 60 mins => 1 min = 1.1667px
  const currentMinutes = today.getHours() * 60 + today.getMinutes();
  const currentPixels = currentMinutes * (70 / 60);

  const weekdayName = selectedDate.toLocaleString('default', { weekday: 'long' });

  return (
    <div className="day-view fade-in">
      {/* Day Header */}
      <div className="day-header-day">
        <span className="day-header-title">
          {selectedDate.toLocaleString('default', { month: 'long', day: 'numeric' })}
        </span>
        <span className="day-header-weekday">{weekdayName}</span>
      </div>

      {/* Grid Container */}
      <div className="day-grid-container" ref={scrollContainerRef}>
        <div className="day-grid">
          {/* Current time red line */}
          {isSelectedToday && (
            <div 
              className="day-current-time-line" 
              style={{ top: `${currentPixels}px` }}
            />
          )}

          {/* Time markings (Background Rows) */}
          {hours.map((hour) => {
            const displayHour = hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
            return (
              <div key={hour} className="day-hour-row">
                <span className="day-time-label">{displayHour}</span>
              </div>
            );
          })}

          {/* Schedule Timeline Column */}
          <div className="day-timeline-column">
            {/* Clickable cells background for event adding */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="day-grid-cell-click"
                style={{ top: `${hour * 70}px` }}
                onClick={() => {
                  const hourStr = `${String(hour).padStart(2, '0')}:00`;
                  onHourClick(selectedDate, hourStr);
                }}
              />
            ))}

            {/* Event Cards */}
            {dayEvents.map((ev) => {
              const startMins = timeToMinutes(ev.startTime);
              const endMins = timeToMinutes(ev.endTime);
              const duration = Math.max(30, endMins - startMins); // at least 30 mins block
              
              // Positioning math: 70px per 60 mins
              const topPx = startMins * (70 / 60);
              const heightPx = duration * (70 / 60);
              const styleColors = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES.work;

              return (
                <div
                  key={ev.id}
                  className="day-event-card"
                  style={{
                    top: `${topPx}px`,
                    height: `${heightPx}px`,
                    background: styleColors.bg,
                    color: styleColors.text,
                    borderLeft: `4px solid ${styleColors.border}`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(ev);
                  }}
                >
                  <span className="day-event-title">{ev.title}</span>
                  <span className="day-event-time">
                    {ev.startTime} – {ev.endTime}
                  </span>
                  {duration >= 45 && ev.description && (
                    <span className="day-event-desc">{ev.description}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
