export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const isMidnightUTC = date.getUTCHours() === 0 && date.getUTCMinutes() === 0;

  // Format only date if time is exactly 00:00 UTC
  if (isMidnightUTC) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  // Otherwise include time
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};


 export const timeAgo=(dateString)=> {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
  
    const intervals = [
      // { label: 'year', seconds: 31536000 },
      // { label: 'month', seconds: 2592000 },
      // { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];
  
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''}`;
      }
    }
  
    return 'just now';
  }
  
  export const formatTime12Hour = (timeString) => {
    const [hourStr, minuteStr] = timeString.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
  
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 -> 12 and 13-23 -> 1-11
  
    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };
  