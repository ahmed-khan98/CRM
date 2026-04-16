import moment from "moment-timezone";


export const Tooltip = ({ text, children }) => (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-zinc-800 text-white text-[10px] rounded-lg shadow-xl z-[999] text-center leading-tight">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

 export const calculateDuration = (inTime, outTime) => {
    if (!inTime || !outTime) return "-";
    const start = moment(inTime);
    const end = moment(outTime);
    const diff = moment.duration(end.diff(start));
    const hours = Math.floor(diff.asHours());
    const minutes = diff.minutes();
    return hours > 0 || minutes > 0 ? `${hours}hr ${minutes}min` : "-";
  };

  export const onlyWorkingHours =(inTime, outTime,totalBreakMinutes) => {
        if (!inTime || !outTime) return "0hr 0min";
        
        const totalMinutes = moment(outTime).diff(moment(inTime), 'minutes');
        const breakMinutes = totalBreakMinutes || 0;
        const workingMinutes = totalMinutes - breakMinutes;
        
        if (workingMinutes <= 0) return "0hr 0min";
        
        const hours = Math.floor(workingMinutes / 60);
        const mins = workingMinutes % 60;
        return `${hours}hr ${mins}min`;
      }

  // Updated Status Classes to handle new logic
  export const getStatusClasses = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 border-green-200";
      case "full-day":
        return "bg-blue-200 text-blue-700 border-blue-200";
      case "late":
      case "half-day":
        return "bg-yellow-200 text-yellow-800 border-yellow-300";
      case "absent":
        return "bg-red-200 text-red-700 border-red-200";
      case "active":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  export const formatTimeOnly = (timeStr) => {
    if (!timeStr) return "-";
    return moment(timeStr).format("hh:mm A");
  };

  export const formatBreakMinutes = (minutes) => {
    if (minutes == null || minutes < 0) return "-";
  
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
  
    if (hrs === 0) return `${mins}min`;
    if (mins === 0) return `${hrs}hr`;
  
    return `${hrs}hr ${mins}min`;
  };