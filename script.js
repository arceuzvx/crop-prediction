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

// Arduino Connection and Data Handling
class ArduinoHandler {
    constructor() {
        this.port = null;
        this.reader = null;
        this.isConnected = false;
        this.sensorData = {
            temperature: [],
            humidity: [],
            soilMoisture: [],
            light: []
        };
    }

    async connect() {
        try {
            // Request a port and open a connection
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: 9600 });
            this.isConnected = true;
            
            const indicator = document.querySelector('.arduino-indicator');
            const message = document.querySelector('.arduino-message');
            indicator.classList.remove('disconnected');
            indicator.classList.add('connected');
            message.textContent = `Arduino Uno connected | Port: ${this.port.getInfo().usbVendorId} | Connected`;
            
            this.startReading();
        } catch (error) {
            console.error('Error connecting to Arduino:', error);
            this.isConnected = false;
        }
    }

    async startReading() {
        while (this.port.readable && this.isConnected) {
            try {
                const reader = this.port.readable.getReader();
                
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        reader.releaseLock();
                        break;
                    }
                    
                    // Parse the received data
                    const data = new TextDecoder().decode(value);
                    this.processData(data);
                }
            } catch (error) {
                console.error('Error reading data:', error);
            }
        }
    }

    processData(data) {
        // Expected format: "temp:25.5,hum:65,soil:42,light:856"
        const readings = data.trim().split(',');
        const values = {};
        
        readings.forEach(reading => {
            const [sensor, value] = reading.split(':');
            values[sensor] = parseFloat(value);
        });

        // Update UI with new values
        if (values.temp) {
            document.getElementById('temperature-value').textContent = `${values.temp.toFixed(1)}°C`;
            this.sensorData.temperature.push(values.temp);
        }
        if (values.hum) {
            document.getElementById('humidity-value').textContent = `${values.hum.toFixed(0)}%`;
            this.sensorData.humidity.push(values.hum);
        }
        if (values.soil) {
            document.getElementById('moisture-value').textContent = `${values.soil.toFixed(0)}%`;
            this.sensorData.soilMoisture.push(values.soil);
        }
        if (values.light) {
            document.getElementById('light-value').textContent = `${values.light.toFixed(0)} lux`;
            this.sensorData.light.push(values.light);
        }

        // Keep only last 6 readings for charts
        Object.keys(this.sensorData).forEach(key => {
            if (this.sensorData[key].length > 6) {
                this.sensorData[key].shift();
            }
        });

        // Update charts
        updateCharts(this.sensorData);
        
        // Update predictions based on real data
        if (Object.keys(values).length === 4) {
            predictCrops(values);
        }
    }

    async disconnect() {
        if (this.port) {
            await this.port.close();
            this.isConnected = false;
            
            const indicator = document.querySelector('.arduino-indicator');
            const message = document.querySelector('.arduino-message');
            indicator.classList.remove('connected');
            indicator.classList.add('disconnected');
            message.textContent = 'Arduino Uno disconnected | Check connection';
        }
    }
}

// Update charts with real data
function updateCharts(sensorData) {
    const charts = {
        temperature: Chart.getChart('temperature-chart'),
        humidity: Chart.getChart('humidity-chart'),
        moisture: Chart.getChart('moisture-chart'),
        light: Chart.getChart('light-chart')
    };

    const timeLabels = Array(6).fill('').map((_, i) => 
        i === 5 ? 'Now' : `${5-i}m ago`
    );

    charts.temperature.data.labels = timeLabels;
    charts.temperature.data.datasets[0].data = sensorData.temperature;
    charts.temperature.update();

    charts.humidity.data.labels = timeLabels;
    charts.humidity.data.datasets[0].data = sensorData.humidity;
    charts.humidity.update();

    charts.moisture.data.labels = timeLabels;
    charts.moisture.data.datasets[0].data = sensorData.soilMoisture;
    charts.moisture.update();

    charts.light.data.labels = timeLabels;
    charts.light.data.datasets[0].data = sensorData.light;
    charts.light.update();
}

// AI-based crop prediction using real sensor data
function predictCrops(sensorData) {
    // Define optimal ranges for different crops
    const cropRequirements = {
        'Corn': {
            temp: { min: 20, max: 30 },
            hum: { min: 50, max: 80 },
            soil: { min: 40, max: 60 },
            light: { min: 500, max: 2000 }
        },
        'Wheat': {
            temp: { min: 15, max: 25 },
            hum: { min: 40, max: 70 },
            soil: { min: 35, max: 55 },
            light: { min: 400, max: 1800 }
        },
        'Potato': {
            temp: { min: 15, max: 25 },
            hum: { min: 60, max: 85 },
            soil: { min: 45, max: 65 },
            light: { min: 300, max: 1600 }
        },
        'Tomato': {
            temp: { min: 18, max: 28 },
            hum: { min: 55, max: 75 },
            soil: { min: 40, max: 60 },
            light: { min: 400, max: 1800 }
        },
        'Rice': {
            temp: { min: 22, max: 32 },
            hum: { min: 70, max: 90 },
            soil: { min: 60, max: 80 },
            light: { min: 600, max: 2200 }
        }
    };

    // Calculate match percentage for each crop
    const predictions = Object.entries(cropRequirements).map(([crop, requirements]) => {
        let matchScore = 0;
        
        // Temperature match
        const tempScore = calculateMatchScore(sensorData.temp, requirements.temp);
        // Humidity match
        const humScore = calculateMatchScore(sensorData.hum, requirements.hum);
        // Soil moisture match
        const soilScore = calculateMatchScore(sensorData.soil, requirements.soil);
        // Light match
        const lightScore = calculateMatchScore(sensorData.light, requirements.light);
        
        matchScore = (tempScore + humScore + soilScore + lightScore) / 4;
        
        return {
            name: crop,
            icon: getCropIcon(crop),
            match: Math.round(matchScore * 100)
        };
    });

    // Sort and update UI
    predictions.sort((a, b) => b.match - a.match);
    updatePredictionUI(predictions.slice(0, 4));
}

function calculateMatchScore(value, range) {
    if (value >= range.min && value <= range.max) {
        return 1;
    }
    const minDist = Math.abs(value - range.min);
    const maxDist = Math.abs(value - range.max);
    const closestDist = Math.min(minDist, maxDist);
    const rangeSize = range.max - range.min;
    return Math.max(0, 1 - (closestDist / rangeSize));
}

function getCropIcon(crop) {
    const icons = {
        'Corn': '🌽',
        'Wheat': '🌾',
        'Potato': '🥔',
        'Tomato': '🍅',
        'Rice': '🍚'
    };
    return icons[crop] || '🌱';
}

function updatePredictionUI(predictions) {
    const grid = document.querySelector('.prediction-grid');
    grid.innerHTML = '';
    
    predictions.forEach((crop, index) => {
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
    const arduinoHandler = new ArduinoHandler();
    
    // Initialize charts with empty data
    initializeCharts();
    
    // Setup connect button
    const connectButton = document.createElement('button');
    connectButton.className = 'arduino-connect-btn';
    connectButton.textContent = 'Connect Arduino';
    document.querySelector('.arduino-status').prepend(connectButton);
    
    connectButton.addEventListener('click', () => {
        if (!arduinoHandler.isConnected) {
            arduinoHandler.connect();
        } else {
            arduinoHandler.disconnect();
        }
    });
});