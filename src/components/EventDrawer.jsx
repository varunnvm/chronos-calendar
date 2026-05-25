import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import './EventDrawer.css';

const CATEGORIES = [
  { id: 'work', name: 'Work', color: 'var(--color-work)', border: '#6366f1' },
  { id: 'personal', name: 'Personal', color: 'var(--color-personal)', border: '#10b981' },
  { id: 'health', name: 'Health', color: 'var(--color-health)', border: '#f43f5e' },
  { id: 'study', name: 'Study', color: 'var(--color-study)', border: '#f59e0b' },
  { id: 'social', name: 'Social', color: 'var(--color-social)', border: '#06b6d4' }
];

const EventDrawer = ({ isOpen, onClose, event, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState('work');
  const [error, setError] = useState('');

  // Sync form state when editing event changes
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setDate(event.date || '');
      setStartTime(event.startTime || '09:00');
      setEndTime(event.endTime || '10:00');
      setCategory(event.category || 'work');
      setError('');
    }
  }, [event, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Event title is required');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    onSave({
      id: event?.id, // undefined for new events
      title,
      description,
      date,
      startTime,
      endTime,
      category
    });
  };

  const isEditing = !!(event && event.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Backdrop */}
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Body */}
          <motion.div
            className="drawer-container"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          >
            {/* Header */}
            <div className="drawer-header">
              <h3 className="drawer-title">
                {isEditing ? 'Edit Event Details' : 'Create New Event'}
              </h3>
              <button className="btn-icon" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                style={{ 
                  color: 'var(--color-health)', 
                  background: 'rgba(244, 63, 94, 0.1)', 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  fontSize: '13px', 
                  marginBottom: '16px',
                  border: '1px solid rgba(244, 63, 94, 0.2)'
                }}
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form className="drawer-form" onSubmit={handleSubmit}>
              {/* Event Title */}
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Design Sync Meeting"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Event Category Selector */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <div className="category-pill-selector">
                  {CATEGORIES.map(cat => {
                    const selected = category === cat.id;
                    return (
                      <div
                        key={cat.id}
                        className={`category-pill ${selected ? 'selected' : ''}`}
                        style={{
                          background: selected ? cat.color : 'rgba(255,255,255,0.02)',
                          borderColor: selected ? cat.border : 'var(--border-light)',
                          boxShadow: selected ? `0 4px 10px ${cat.color}33` : 'none'
                        }}
                        onClick={() => setCategory(cat.id)}
                      >
                        {cat.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Start & End Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input 
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input 
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  rows={4}
                  placeholder="Add notes, agenda, location, or details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Actions Footer */}
              <div className="drawer-actions">
                {isEditing && (
                  <button 
                    type="button" 
                    className="drawer-btn-delete"
                    onClick={() => onDelete(event.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                <button 
                  type="submit" 
                  className="btn-primary drawer-btn-save"
                >
                  {isEditing ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventDrawer;
