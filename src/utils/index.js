export function formatTimeToIST(utcDateString) {
  const date = new Date(utcDateString);
  const time = date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return time.replace(/(am|pm)/i, (match) => match.toUpperCase());
}
export function formatDateToIST(dateStr){
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
export function convertTo12Hour(time24) {
  const [hour, minute] = time24.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // convert 0 -> 12
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}
