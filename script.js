function initializeCharts() {
    const timeLabels = ['24h ago', '12h ago', '6h ago', '3h ago', '1h ago', 'Now'];
    
    const temperatureData = {
        labels: timeLabels,
        datasets: [{
            label: 'Temperature (°C)',
            data: [25, 24, 23, 25, 27, 26],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.3,
            fill: true
        }]
    };
    
    const humidityData = {
        labels: timeLabels,
        datasets: [{
            label: 'Humidity (%)',
            data: [60, 62, 64, 67, 66, 65],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.3,
            fill: true
        }]
    };
    
    const moistureData = {
        labels: timeLabels,
        datasets: [{
            label: 'Soil Moisture (%)',
            data: [45, 44, 43, 42, 42, 42],
            borderColor: '#673AB7',
            backgroundColor: 'rgba(103, 58, 183, 0.1)',
            tension: 0.3,
            fill: true
        }]
    };
    
    const lightData = {
        labels: timeLabels,
        datasets: [{
            label: 'Light (lux)',
            data: [200, 350, 600, 780, 850, 856],
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            tension: 0.3,
            fill: true
        }]
    };
    
    const chartConfig = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    };
    
    new Chart(
        document.getElementById('temperature-chart'),
        {
            type: 'line',
            data: temperatureData,
            options: chartConfig
        }
    );
    
    new Chart(
        document.getElementById('humidity-chart'),
        {
            type: 'line',
            data: humidityData,
            options: chartConfig
        }
    );
    
    new Chart(
        document.getElementById('moisture-chart'),
        {
            type: 'line',
            data: moistureData,
            options: chartConfig
        }
    );
    
    new Chart(
        document.getElementById('light-chart'),
        {
            type: 'line',
            data: lightData,
            options: chartConfig
        }
    );
}

// Simulate sensor data updates
function simulateSensorUpdates() {
    // Temperature variation
    setInterval(() => {
        const temp = 25 + Math.random() * 2;
        document.getElementById('temperature-value').textContent = `${temp.toFixed(1)}°C`;
    }, 5000);
    
    // Humidity variation
    setInterval(() => {
        const humidity = 63 + Math.random() * 4;
        document.getElementById('humidity-value').textContent = `${humidity.toFixed(0)}%`;
    }, 6000);
    
    // Soil moisture variation
    setInterval(() => {
        const moisture = 40 + Math.random() * 4;
        document.getElementById('moisture-value').textContent = `${moisture.toFixed(0)}%`;
    }, 7000);
    
    // Light variation
    setInterval(() => {
        const light = 800 + Math.random() * 100;
        document.getElementById('light-value').textContent = `${light.toFixed(0)} lux`;
    }, 8000);
}

// Arduino connection simulation
function simulateArduinoConnection() {
    let isConnected = true;
    const indicator = document.querySelector('.arduino-indicator');
    const message = document.querySelector('.arduino-message');
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            isConnected = !isConnected;
            if (isConnected) {
                indicator.classList.remove('disconnected');
                indicator.classList.add('connected');
                message.textContent = 'Arduino Uno connected | Port: COM5 | Last update: 1 second ago';
            } else {
                indicator.classList.remove('connected');
                indicator.classList.add('disconnected');
                message.textContent = 'Arduino Uno disconnected | Check connection';
                
                // Auto-reconnect after 5 seconds
                setTimeout(() => {
                    isConnected = true;
                    indicator.classList.remove('disconnected');
                    indicator.classList.add('connected');
                    message.textContent = 'Arduino Uno connected | Port: COM5 | Last update: 1 second ago';
                }, 5000);
            }
        } else if (isConnected) {
            const seconds = Math.floor(Math.random() * 10) + 1;
            message.textContent = `Arduino Uno connected | Port: COM5 | Last update: ${seconds} second${seconds > 1 ? 's' : ''} ago`;
        }
    }, 3000);
}

// Crop prediction refresh animation
function setupPredictionRefresh() {
    const refreshButton = document.getElementById('refresh-predictions');
    
    refreshButton.addEventListener('click', function() {
        // Add spinning animation
        const icon = this.querySelector('i');
        icon.classList.add('fa-spin');
        
        // Disable button during refresh
        this.disabled = true;
        
        // Simulate prediction calculation delay
        setTimeout(() => {
            // Stop spinning and re-enable button
            icon.classList.remove('fa-spin');
            this.disabled = false;
            
            // Update predictions
            updatePredictions();
        }, 2000);
    });
}

// Update crop predictions
function updatePredictions() {
    const crops = [
        { name: 'Corn', icon: '🌽', match: Math.floor(Math.random() * 10) + 90 },
        { name: 'Wheat', icon: '🌾', match: Math.floor(Math.random() * 15) + 75 },
        { name: 'Potato', icon: '🥔', match: Math.floor(Math.random() * 20) + 70 },
        { name: 'Tomato', icon: '🍅', match: Math.floor(Math.random() * 20) + 60 },
        { name: 'Rice', icon: '🍚', match: Math.floor(Math.random() * 20) + 60 },
        { name: 'Barley', icon: '🌾', match: Math.floor(Math.random() * 20) + 50 },
        { name: 'Beans', icon: '🥜', match: Math.floor(Math.random() * 30) + 40 },
        { name: 'Lettuce', icon: '🥬', match: Math.floor(Math.random() * 30) + 40 }
    ];
    
    // Sort by match percentage
    crops.sort((a, b) => b.match - a.match);
    
    // Take top 4
    const topCrops = crops.slice(0, 4);
    
    // Get the prediction grid
    const grid = document.querySelector('.prediction-grid');
    
    // Clear the grid
    grid.innerHTML = '';
    
    // Add new crop cards
    topCrops.forEach((crop, index) => {
        const card = document.createElement('div');
        card.className = 'crop-card';
        if (index === 0) {
            card.classList.add('recommended');
        }
        
        card.innerHTML = `
            <div class="crop-icon">${crop.icon}</div>
            <div class="crop-name">${crop.name}</div>
            <div class="crop-confidence">${crop.match}% match</div>
        `;
        
        grid.appendChild(card);
    });
}

// Initialize everything when the page loads
window.addEventListener('load', function() {
    initializeCharts();
    simulateSensorUpdates();
    simulateArduinoConnection();
    setupPredictionRefresh();
});