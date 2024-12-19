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

document.getElementById('timeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const hour = document.getElementById('hourInput').value;
    const meridian = document.getElementById('meridianInput').value;
    const timeInput = `${hour} ${meridian}`;
    const locations = findLocationsAtTime(timeInput);
    const resultList = document.getElementById('result');
    
    resultList.innerHTML = '';
    
    if (Array.isArray(locations)) {
        locations.forEach(loc => {
            const li = document.createElement('li');
            li.textContent = `${loc.location} (${loc.timezone}) - ${loc.fullTime}`;
            resultList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = locations;
        resultList.appendChild(li);
    }

    // Add to recent searches
    addRecentSearch(hour, meridian);
});

// Add this at the beginning of your script.js file
function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    // Update analog clock hands
    // ... existing analog clock code ...

    // Update digital display
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert to 12-hour format
    const displayMinutes = minutes.toString().padStart(2, '0');
    const displaySeconds = seconds.toString().padStart(2, '0');
    
    document.getElementById('digital-time').textContent = 
        `${displayHours}:${displayMinutes}:${displaySeconds} ${ampm}`;
}

// Update clock every second
setInterval(updateClock, 1000);
// Initial call
updateClock();

// Add to your existing JavaScript
function addRecentSearch(hour, meridian) {
    const recentList = document.getElementById('recentSearches');
    const searchText = `${hour}:00 ${meridian}`;
    
    // Create new list item
    const li = document.createElement('li');
    li.textContent = searchText;
    
    // Add click handler to repeat search
    li.addEventListener('click', () => {
        document.getElementById('hourInput').value = hour;
        document.getElementById('meridianInput').value = meridian;
        document.getElementById('timeForm').dispatchEvent(new Event('submit'));
    });
    
    // Add to top of list
    recentList.insertBefore(li, recentList.firstChild);
    
    // Keep only last 5 searches
    while (recentList.children.length > 5) {
        recentList.removeChild(recentList.lastChild);
    }
}

// Add this to your form submit handler
document.getElementById('timeForm').addEventListener('submit', (e) => {
    // ... existing submit code ...
    
    // Add to recent searches
    const hour = document.getElementById('hourInput').value;
    const meridian = document.getElementById('meridianInput').value;
    addRecentSearch(hour, meridian);
});
