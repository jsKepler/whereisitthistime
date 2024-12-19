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

// Clock and Date Update Function
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Update time
    document.getElementById('hours').textContent = (hours % 12 || 12).toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    document.getElementById('ampm').textContent = hours >= 12 ? 'PM' : 'AM';
    
    // Update date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('day').textContent = days[now.getDay()];
    document.getElementById('date').textContent = `${months[now.getMonth()]} ${now.getDate()}`;

    // Update timezone with UTC offset
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcOffset = -(new Date().getTimezoneOffset() / 60);
    const utcString = `UTC${utcOffset >= 0 ? '+' : ''}${utcOffset}`;
    document.getElementById('timezone').textContent = `${timezone} (${utcString})`;
}

// Recent Searches Function
function addRecentSearch(hour, meridian) {
    const recentList = document.getElementById('recentSearches');
    const searchText = `${hour}:00 ${meridian}`;
    
    // Check if this search already exists
    const existingSearches = Array.from(recentList.children);
    if (existingSearches.some(li => li.textContent === searchText)) {
        return; // Skip if already in list
    }
    
    const li = document.createElement('li');
    li.textContent = searchText;
    
    li.addEventListener('click', () => {
        document.getElementById('hourInput').value = hour;
        document.getElementById('meridianInput').value = meridian;
        document.getElementById('timeForm').dispatchEvent(new Event('submit'));
    });
    
    recentList.insertBefore(li, recentList.firstChild);
    
    while (recentList.children.length > 5) {
        recentList.removeChild(recentList.lastChild);
    }
}

// Form Submit Handler
document.getElementById('timeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const hour = document.getElementById('hourInput').value;
    const meridian = document.getElementById('meridianInput').value;
    addRecentSearch(hour, meridian);
    // Your existing form submission code here
});

// Start the clock
setInterval(updateClock, 1000);
// Initial call to avoid delay
updateClock();
