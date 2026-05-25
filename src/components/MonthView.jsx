import React from 'react';
import './MonthView.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CATEGORY_COLORS = {
  work: { bg: 'rgba(99, 102, 241, 0.15)', text: '#a5b4fc', border: 'var(--color-work)' },
  personal: { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', border: 'var(--color-personal)' },
  health: { bg: 'rgba(244, 63, 94, 0.15)', text: '#fda4af', border: 'var(--color-health)' },
  study: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fde047', border: 'var(--color-study)' },
  social: { bg: 'rgba(6, 182, 212, 0.15)', text: '#67e8f9', border: 'var(--color-social)' }
};

const MonthView = ({
  currentMonth,
  selectedDate,
  setSelectedDate,
  events,
  onCellClick,
  onEventClick
}) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarCells = [];

  // Previous month padding
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const dateObj = new Date(year, month - 1, day);
    calendarCells.push({ day, dateObj, isCurrentMonth: false });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    calendarCells.push({ day, dateObj, isCurrentMonth: true });
  }

  // Next month padding to fill a 6-row grid (42 cells)
  const remainingCells = 42 - calendarCells.length;
  for (let day = 1; day <= remainingCells; day++) {
    const dateObj = new Date(year, month + 1, day);
    calendarCells.push({ day, dateObj, isCurrentMonth: false });
  }

  const formatDateKey = (date) => {
    // Return YYYY-MM-DD in local time
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

  const today = new Date();

  return (
    <div className="month-view fade-in">
      {/* Days of Week Header */}
      <div className="month-weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="month-grid">
        {calendarCells.map((cell, idx) => {
          const dateKey = formatDateKey(cell.dateObj);
          
          // Get events for this cell, sorted by start time
          const cellEvents = events
            .filter((ev) => ev.date === dateKey)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          const selected = isSameDay(cell.dateObj, selectedDate);
          const currentToday = isSameDay(cell.dateObj, today);

          return (
            <div
              key={idx}
              className={`month-day-cell 
                ${cell.isCurrentMonth ? '' : 'outside'} 
                ${currentToday ? 'today' : ''} 
                ${selected ? 'selected' : ''}
              `}
              onClick={() => onCellClick(cell.dateObj)}
            >
              <div className="month-day-header">
                <span className="month-day-num">{cell.day}</span>
              </div>

              {/* Cell Events List */}
              <div className="month-event-list">
                {cellEvents.map((ev) => {
                  const styleColors = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.work;
                  return (
                    <div
                      key={ev.id}
                      className="month-event-badge"
                      style={{
                        background: styleColors.bg,
                        color: styleColors.text,
                        borderLeft: `3px solid ${styleColors.border}`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(ev);
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{ev.startTime}</span>
                      <span>{ev.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
