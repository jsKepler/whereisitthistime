// Function to find locations at a given time
function findLocationsAtTime(inputTime) {
    // Trim the input to remove unnecessary spaces
    inputTime = inputTime.trim();

    // Parse the input time (e.g., "3 PM" or "10 AM")
    const timeRegex = /^(\d{1,2})\s*(AM|PM)$/i;  // Ensures format: Number followed by AM/PM (case-insensitive)
    const match = inputTime.match(timeRegex);

    if (!match) {
        return "Invalid time format. Please use format like '3 PM' or '10 AM'";
    }

    let hour = parseInt(match[1]);
    const meridiem = match[2].toUpperCase(); // Converts AM/PM to uppercase for consistent comparison
    
    // Convert to 24-hour format
    if (meridiem === 'PM' && hour !== 12) {
        hour += 12; // Add 12 to hour if PM and not 12
    } else if (meridiem === 'AM' && hour === 12) {
        hour = 0; // Convert 12 AM to 0 (midnight)
    }

    // Debugging line to check hour parsing
    console.log(`Parsed Time: ${hour} ${meridiem}`);

    const locations = [];
    const currentDate = new Date();
    
    // Get all timezone names
    const allTimezones = moment.tz.names();
    
    // Check each timezone
    allTimezones.forEach(timezone => {
        const timeInZone = moment.tz(currentDate, timezone);
        console.log(`Checking timezone: ${timezone}, Current time: ${timeInZone.format('h:mm A')}`); // Debugging line
        
        // Check if the hour matches the input hour
        if (timeInZone.hour() === hour) {
            // Get the location name from timezone
            const location = timezone.replace(/_/g, ' ').split('/').pop();
            locations.push({
                timezone: timezone,
                location: location,
                fullTime: timeInZone.format('h:mm A') // 12-hour format with AM/PM
            });
        }
    });

    console.log(locations); // Debugging line to check results
    return locations.length > 0 
        ? locations 
        : "No locations found for the specified time";
}

// Handle form submission
document.getElementById('timeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the input time from the user and trim it for spaces
    const inputTime = document.getElementById('timeInput').value.trim();

    // Call the function to get matching locations
    const locations = findLocationsAtTime(inputTime);

    // Display results
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (Array.isArray(locations)) {
        locations.forEach(location => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `
                <h3>${location.location}</h3>
                <p>Timezone: ${location.timezone}</p>
                <p class="time">${location.fullTime}</p>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        const noResults = document.createElement('div');
        noResults.classList.add('no-results');
        noResults.textContent = locations;
        resultsContainer.appendChild(noResults);
    }
});
