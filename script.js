// Change the import to require
const moment = require('moment-timezone');

function findLocationsAtTime(inputTime) {
    // Parse the input time (e.g., "3 PM" or "10 AM")
    const timeRegex = /(\d+)\s*(AM|PM)/i;
    const match = inputTime.match(timeRegex);
    
    if (!match) {
        return "Invalid time format. Please use format like '3 PM' or '10 AM'";
    }

    let hour = parseInt(match[1]);
    const meridiem = match[2].toUpperCase();
    
    // Convert to 24-hour format
    if (meridiem === 'PM' && hour !== 12) {
        hour += 12;
    } else if (meridiem === 'AM' && hour === 12) {
        hour = 0;
    }

    const locations = [];
    const currentDate = new Date();
    
    // Get all timezone names
    const allTimezones = moment.tz.names();
    
    // Check each timezone
    allTimezones.forEach(timezone => {
        const timeInZone = moment.tz(currentDate, timezone);
        if (timeInZone.hour() === hour) {
            // Get the location name from timezone
            const location = timezone.replace(/_/g, ' ').split('/').pop();
            locations.push({
                timezone: timezone,
                location: location,
                fullTime: timeInZone.format('h:mm A')
            });
        }
    });

    return locations.length > 0 
        ? locations 
        : "No locations found for the specified time";
}

// Example usage:
// const locations = findLocationsAtTime("3 PM");
// console.log(locations);

module.exports = findLocationsAtTime;
