// Handle form submission
document.getElementById('timeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the input time from the user
    const inputTime = document.getElementById('timeInput').value.trim();
    
    // Parse the input time (assumes 12-hour format with AM/PM)
    const inputDate = new Date(`1970-01-01T${inputTime}:00`);
    
    if (isNaN(inputDate)) {
        alert("Please enter a valid time.");
        return;
    }

    // Define the regions and their time zone offsets
    const timeZones = [
        { region: "China", timeZone: "Asia/Shanghai" },
        { region: "United Kingdom", timeZone: "Europe/London" },
        { region: "United States (Eastern Time)", timeZone: "America/New_York" },
        { region: "United States (Pacific Time)", timeZone: "America/Los_Angeles" },
        { region: "Germany", timeZone: "Europe/Berlin" },
        { region: "Australia", timeZone: "Australia/Sydney" },
        // Add more regions and time zones as needed
    ];

    // Get the result element where we display the regions
    const resultList = document.getElementById('result');
    resultList.innerHTML = ''; // Clear previous results

    // Check each region's current time
    timeZones.forEach(function (zone) {
        const localTime = new Date(inputDate.toLocaleString("en-US", { timeZone: zone.timeZone }));
        
        const formattedLocalTime = localTime.toLocaleString("en-US", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        // Compare the formatted input time with the local time of the region
        if (formattedLocalTime === inputTime) {
            const li = document.createElement('li');
            li.textContent = zone.region;
            resultList.appendChild(li);
        }
    });

    if (resultList.innerHTML === '') {
        const li = document.createElement('li');
        li.textContent = "No regions found for this time.";
        resultList.appendChild(li);
    }
});
