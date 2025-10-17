import './App.css'
import TimeSlotScheduler from './components/TimeSlotScheduler'

function App() {
  // Sample events data
  const events = [
    {
      startTime: "09:00",
      endTime: "09:45",
      caption: "Team Standup"
    },
    {
      startTime: "10:30",
      endTime: "11:15",
      caption: "Client Meeting",
      color: "#8B5CF6"
    },
    {
      startTime: "13:00",
      endTime: "14:30",
      caption: "Project Review",
      color: "#EC4899"
    },
    {
      startTime: "15:16",
      endTime: "15:36",
      caption: "Meeting1",
      color: "#10B981"
    },
    {
      startTime: "16:00",
      endTime: "17:00",
      caption: "Development Time",
      color: "#F59E0B"
    }
  ];

  return (
    <div className="app">
      <TimeSlotScheduler 
        events={events}
        startHour={0}
        endHour={24}
      />
    </div>
  )
}

export default App
