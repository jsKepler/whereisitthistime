document.getElementById('timeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputTime = document.getElementById('timeInput').value;

    // Simulate a mapping of times to regions
    const timeToRegions = {
        "3:55 PM": ["China", "Parts of Russia", "Philippines"],
        "12:00 PM": ["United Kingdom", "Portugal", "Iceland"],
        // Add more mappings here...
    };

    const resultList = document.getElementById('result');
    if (timeToRegions[inputTime]) {
        resultList.innerHTML = timeToRegions[inputTime].map(region => `<li>${region}</li>`).join('');
    } else {
        resultList.innerHTML = `<li>No regions found for this time.</li>`;
    }
});
//
//  script.js
//  Time to Location Converter
//
//  Created by Xirui Lin on 18/12/2024.
//
