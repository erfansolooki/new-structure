import React, { useState, useRef, useEffect } from 'react';
import './TimeSlotScheduler.css';

interface TimeEvent {
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm"
  caption: string;
  color?: string;    // Optional color for the event
}

interface TimeSlotSchedulerProps {
  events: TimeEvent[];
  startHour?: number;  // Default: 0 (midnight)
  endHour?: number;    // Default: 24 (midnight next day)
}

const TimeSlotScheduler: React.FC<TimeSlotSchedulerProps> = ({ 
  events, 
  startHour = 0, 
  endHour = 24 
}) => {
  // Zoom level: 1 = 1 minute per slot, 15 = 15 minutes per slot
  const [slotMinutes, setSlotMinutes] = useState<number>(15);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeSlotsRef = useRef<HTMLDivElement>(null);

  // Parse time string "HH:mm" to minutes since midnight
  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Format minutes to "HH:mm"
  const formatTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Generate random color for events
  const getEventColor = (index: number): string => {
    const colors = [
      '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', 
      '#F59E0B', '#EF4444', '#14B8A6', '#6366F1'
    ];
    return colors[index % colors.length];
  };

  // Handle mouse wheel for zoom on time slots only
  useEffect(() => {
    const timeSlots = timeSlotsRef.current;
    if (!timeSlots) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      setSlotMinutes(prev => {
        const delta = e.deltaY > 0 ? 1 : -1; // Zoom out if scrolling down, zoom in if scrolling up
        let newValue = prev + delta;
        
        // Clamp between 1 and 15
        newValue = Math.max(1, Math.min(15, newValue));
        
        return newValue;
      });
    };

    // Add passive: false to allow preventDefault
    timeSlots.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      timeSlots.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Calculate total time slots
  const totalMinutes = (endHour - startHour) * 60;
  const totalSlots = Math.floor(totalMinutes / slotMinutes);

  // Generate time slots
  const timeSlots = Array.from({ length: totalSlots }, (_, i) => {
    const startMinutes = startHour * 60 + i * slotMinutes;
    const endMinutes = startMinutes + slotMinutes;
    return {
      start: formatTime(startMinutes),
      end: formatTime(endMinutes),
      startMinutes,
      endMinutes
    };
  });

  // Calculate event position and size (vertical)
  const getEventStyle = (event: TimeEvent, index: number) => {
    const eventStartMinutes = parseTime(event.startTime);
    const eventEndMinutes = parseTime(event.endTime);
    
    // Calculate exact position based on minutes from start time
    const offsetStartMinutes = eventStartMinutes - (startHour * 60);
    const offsetEndMinutes = eventEndMinutes - (startHour * 60);
    
    // Total height in pixels
    const totalHeightPx = totalSlots * 40;
    
    // Calculate position and height in pixels based on exact time
    const topPx = (offsetStartMinutes / totalMinutes) * totalHeightPx;
    const heightPx = ((offsetEndMinutes - offsetStartMinutes) / totalMinutes) * totalHeightPx;
    
    return {
      top: `${topPx}px`,
      height: `${heightPx}px`,
      backgroundColor: event.color || getEventColor(index),
    };
  };

  return (
    <div className="time-slot-scheduler">
      <div className="scheduler-header">
        <h2>Time Slot Scheduler</h2>
        <div className="zoom-info">
          Zoom: {slotMinutes} minute{slotMinutes > 1 ? 's' : ''} per slot
          <span className="zoom-hint">(Scroll to zoom: 1-15 minutes)</span>
        </div>
      </div>
      
      <div 
        className="scheduler-container" 
        ref={containerRef}
      >
        {/* Time slots background */}
        <div 
          ref={timeSlotsRef}
          className="time-slots" 
          style={{ height: `${totalSlots * 40}px` }}
        >
          {timeSlots.map((slot, index) => (
            <div 
              key={index} 
              className="time-slot"
              style={{ height: '40px' }}
            >
              <div className="time-label">
                {slot.start}
              </div>
            </div>
          ))}
        </div>

        {/* Events layer */}
        <div className="events-layer" style={{ height: `${totalSlots * 40}px` }}>
          {events.map((event, index) => (
            <div
              key={index}
              className="event-box"
              style={getEventStyle(event, index)}
              title={`${event.caption}: ${event.startTime} - ${event.endTime}`}
            >
              <div className="event-content">
                <div className="event-caption">{event.caption}</div>
                <div className="event-time">
                  {event.startTime} - {event.endTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotScheduler;

